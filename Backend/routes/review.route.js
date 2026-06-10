const express = require("express");
const { getProductReviews, createReview } = require("../controller/review.controller");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/:productId", getProductReviews);
router.post("/", protect, createReview);

module.exports = router;
