let stripeInstance = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripeInstance = require("stripe")(process.env.STRIPE_SECRET_KEY);
}

const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ message: "Amount is required" });

    // Amount must be in subunits (paise for INR, cents for USD)
    const orderAmount = Math.round(Number(amount));

    if (stripeInstance) {
      const paymentIntent = await stripeInstance.paymentIntents.create({
        amount: orderAmount,
        currency: "inr",
        metadata: { userId: req.user._id.toString() },
      });

      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id
      });
    } else {
      // Graceful fallback for mock mode
      console.log("Stripe: Mock mode activated (missing STRIPE_SECRET_KEY)");
      res.status(200).json({
        clientSecret: `mock_secret_${Date.now()}`,
        id: `mock_pi_${Date.now()}`
      });
    }
  } catch (error) {
    console.error("Create payment intent error:", error);
    res.status(500).json({ message: "Failed to create payment intent", error: error.message });
  }
};

const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  if (stripeInstance && sig && process.env.STRIPE_WEBHOOK_SECRET) {
    try {
      event = stripeInstance.webhooks.constructEvent(
        req.body, // Must be raw body buffer
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Stripe Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    // If stripe credentials are not configured, mock webhook processor
    console.log("Stripe: Mock webhook event processed (no stripe configured or signature missing)");
    try {
      // Attempt to parse mock payload if sent as json/buffer
      const payload = JSON.parse(req.body.toString());
      event = payload;
    } catch (e) {
      event = { type: "payment_intent.succeeded", data: { object: { id: "mock_pi" } } };
    }
  }

  // Handle Stripe Webhook Events
  if (event) {
    console.log(`Received Stripe Webhook Event: ${event.type}`);
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent for ${paymentIntent.amount} succeeded.`);
        // Optional: Update order state in database if order was already saved as pending
        break;
      case "charge.refunded":
        const charge = event.data.object;
        console.log(`Charge ${charge.id} was refunded.`);
        break;
      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }
  }

  res.json({ received: true });
};

module.exports = { createPaymentIntent, handleWebhook };
