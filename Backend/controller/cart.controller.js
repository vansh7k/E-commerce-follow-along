const Cart = require('../model/cart.model');

// Get cart for a user
exports.getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate('products.productId');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error });
  }
};

// Create or update cart
exports.updateCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // Update existing cart
      const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
      if (productIndex > -1) {
        // Product exists, update quantity
        cart.products[productIndex].quantity += quantity;
      } else {
        // Product does not exist, add to cart
        cart.products.push({ productId, quantity });
      }
    } else {
      // Create new cart
      cart = new Cart({
        userId,
        products: [{ productId, quantity }]
      });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart', error });
  }
};

// Increase quantity
exports.increaseQuantity = async (req, res) => {
  const { userId, productId } = req.body;
  await updateCart(req, res, userId, productId, 1);
};

// Decrease quantity
exports.decreaseQuantity = async (req, res) => {
  const { userId, productId } = req.body;
  await updateCart(req, res, userId, productId, -1);
};
