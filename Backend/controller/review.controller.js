const Review = require("../model/review.model");

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId }).populate("user", "name");
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { productId, rating, body } = req.body;
    if (!productId || !rating || !body) {
      return res.status(400).json({ message: "Product ID, rating (1-5), and body are required." });
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating: Number(rating),
      body
    });

    const populatedReview = await Review.findById(review._id).populate("user", "name");
    res.status(201).json({ message: "Review submitted successfully", review: populatedReview });
  } catch (error) {
    res.status(500).json({ message: "Error submitting review", error: error.message });
  }
};

module.exports = { getProductReviews, createReview };
