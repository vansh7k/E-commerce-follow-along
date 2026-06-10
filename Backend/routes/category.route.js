const express = require("express");
const { getCategories, createCategory } = require("../controller/category.controller");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/", getCategories);
router.post("/", protect, adminOnly, createCategory);

module.exports = router;
