const Product = require("../model/product.model");
const Category = require("../model/category.model");
const fs = require("fs");

let cloudinaryInstance = null;
const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  try {
    cloudinaryInstance = require("cloudinary").v2;
    cloudinaryInstance.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  } catch (error) {
    console.error("Failed to load Cloudinary library:", error);
  }
}

// Create slug helper
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
};

// Handle file uploads helper
const uploadImages = async (files) => {
  const paths = [];
  if (!files || files.length === 0) return paths;

  for (const file of files) {
    if (cloudinaryInstance) {
      try {
        const result = await cloudinaryInstance.uploader.upload(file.path, {
          folder: "maverick-streetwear",
        });
        paths.push(result.secure_url);
        // Clean up local temp file after upload
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (err) {
        console.error("Cloudinary upload failed, falling back to local file:", err);
        paths.push(`/uploads/${file.filename}`);
      }
    } else {
      // Local fallback url path
      paths.push(`/uploads/${file.filename}`);
    }
  }
  return paths;
};

// Create Product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, comparePrice, categoryId, tags, variants, featured, published, sku, stock } = req.body;

    if (!name || !description || !price || !categoryId) {
      return res.status(400).json({ message: "Name, description, price, and category are required." });
    }

    const slug = slugify(name);
    let finalSlug = slug;
    const slugExists = await Product.findOne({ slug });
    if (slugExists) {
      finalSlug = `${slug}-${Date.now()}`;
    }

    let parsedVariants = [];
    if (variants) {
      parsedVariants = typeof variants === "string" ? JSON.parse(variants) : variants;
    }

    let parsedTags = [];
    if (tags) {
      parsedTags = typeof tags === "string" ? tags.split(",").map(t => t.trim()) : tags;
    }

    // Upload files to Cloudinary/Local
    const imagePaths = await uploadImages(req.files);

    const product = await Product.create({
      name,
      slug: finalSlug,
      description,
      price: Number(price),
      comparePrice: comparePrice ? Number(comparePrice) : undefined,
      category: categoryId,
      images: imagePaths,
      tags: parsedTags,
      variants: parsedVariants,
      featured: featured === "true" || featured === true,
      published: published !== "false" && published !== false,
      sku: sku || "",
      stock: Number(stock) || 0
    });

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, comparePrice, categoryId, tags, variants, featured, published, sku, stock } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedData = {};
    if (name) {
      updatedData.name = name;
      updatedData.slug = slugify(name);
    }
    if (description) updatedData.description = description;
    if (price) updatedData.price = Number(price);
    if (comparePrice !== undefined) updatedData.comparePrice = comparePrice ? Number(comparePrice) : null;
    if (categoryId) updatedData.category = categoryId;
    if (sku !== undefined) updatedData.sku = sku;
    if (stock !== undefined) updatedData.stock = Number(stock);
    if (featured !== undefined) updatedData.featured = featured === "true" || featured === true;
    if (published !== undefined) updatedData.published = published === "true" || published === true;

    if (tags) {
      updatedData.tags = typeof tags === "string" ? tags.split(",").map(t => t.trim()) : tags;
    }
    if (variants) {
      updatedData.variants = typeof variants === "string" ? JSON.parse(variants) : variants;
    }

    if (req.files && req.files.length > 0) {
      const newImages = await uploadImages(req.files);
      updatedData.images = newImages;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};

// Get Single Product by Slug
const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug }).populate("category");
    if (!product) {
      return res.status(404).json({ message: "This product doesn't exist. Neither do trends." });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

// Get All Products (filters, sorting, search, pagination)
const getAllProducts = async (req, res) => {
  try {
    const { category, size, priceMin, priceMax, sort, search, page = 1, limit = 9 } = req.query;

    const query = { published: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) {
        query.category = cat._id;
      } else {
        query.category = category;
      }
    }

    if (size) {
      const sizeList = Array.isArray(size) ? size : size.split(",");
      query["variants.size"] = { $in: sizeList };
    }

    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = Number(priceMin);
      if (priceMax) query.price.$lte = Number(priceMax);
    }

    let sortOptions = {};
    if (sort === "price-asc") {
      sortOptions.price = 1;
    } else if (sort === "price-desc") {
      sortOptions.price = -1;
    } else if (sort === "newest") {
      sortOptions.createdAt = -1;
    } else {
      sortOptions.createdAt = -1;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("category")
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      products,
      page: Number(page),
      totalPages: Math.ceil(totalProducts / Number(limit)),
      totalProducts
    });
  } catch (error) {
    console.error("Fetch products error:", error);
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductBySlug,
  getAllProducts
};