const Category = require("../model/category.model");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Category name is required" });

    const slug = name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");
    
    const category = await Category.create({ name, slug });
    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error: error.message });
  }
};

module.exports = { getCategories, createCategory };
