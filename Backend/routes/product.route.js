const express = require("express");
const { createProduct, updateProduct, deleteProduct, getProductBySlug, getAllProducts } = require("../controller/product.controller");
const { protect, adminOnly } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:slug", getProductBySlug);

router.post("/", protect, adminOnly, upload.array("images", 5), createProduct);
router.put("/:id", protect, adminOnly, upload.array("images", 5), updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;