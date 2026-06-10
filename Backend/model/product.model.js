const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  color: { type: String, default: "" },
  stock: { type: Number, required: true, default: 0 },
  sku: { type: String, default: "" }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  comparePrice: { type: Number },
  images: [{ type: String }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  tags: [{ type: String }],
  variants: [variantSchema],
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: true },
  stock: { type: Number, required: true, default: 0 },
  sku: { type: String, default: "" }
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
