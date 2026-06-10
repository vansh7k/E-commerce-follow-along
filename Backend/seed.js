const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./model/user.model");
const Category = require("./model/category.model");
const Product = require("./model/product.model");
const Review = require("./model/review.model");
const Wishlist = require("./model/wishlist.model");
const Order = require("./model/order.model");

const mongoUri =
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/maverick-streetwear";

const seedDatabase = async () => {
  try {
    console.log("Connecting to database for seeding...");
    await mongoose.connect(mongoUri);
    console.log("Connected. Clearing old data...");

    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Review.deleteMany({});
    await Wishlist.deleteMany({});
    await Order.deleteMany({});

    console.log("Cleared. Seeding users...");

    // Password Hashing
    const adminPassword = await bcrypt.hash("admin123", 10);
    const customerPassword = await bcrypt.hash("test123", 10);

    const admin = await User.create({
      name: "Admin User",
      email: "admin@maverick.com",
      password: adminPassword,
      role: "admin",
      addresses: [
        {
          street: "12 Industrial Sector",
          city: "New Delhi",
          state: "Delhi",
          zipCode: "110001",
          country: "India",
          isDefault: true
        }
      ]
    });

    const customer = await User.create({
      name: "John Doe",
      email: "test@maverick.com",
      password: customerPassword,
      role: "customer",
      addresses: [
        {
          street: "45 Urban Lane",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400001",
          country: "India",
          isDefault: true
        }
      ]
    });

    console.log("Seeding categories...");
    const tops = await Category.create({ name: "TOPS", slug: "tops" });
    const bottoms = await Category.create({ name: "BOTTOMS", slug: "bottoms" });
    const outerwear = await Category.create({ name: "OUTERWEAR", slug: "outerwear" });

    console.log("Seeding products...");
    const productsData = [
      // TOPS (4 products)
      {
        name: "OS-V1 HOODIE",
        slug: "os-v1-hoodie",
        description: "HEAVYWEIGHT COTTON HOODIE. RAW HEM. DROP SHOULDERS. GARMET DYED FOR A FADED LOOK.",
        price: 3200,
        comparePrice: 4500,
        category: tops._id,
        tags: ["heavyweight", "hoodie", "streetwear"],
        featured: true,
        published: true,
        stock: 25,
        sku: "TOP-HD-001",
        images: ["/uploads/os-v1-hoodie.jpg"],
        variants: [
          { size: "S", stock: 5, sku: "TOP-HD-001-S" },
          { size: "M", stock: 10, sku: "TOP-HD-001-M" },
          { size: "L", stock: 8, sku: "TOP-HD-001-L" },
          { size: "XL", stock: 2, sku: "TOP-HD-001-XL" }
        ]
      },
      {
        name: "RAW EDGE TEE",
        slug: "raw-edge-tee",
        description: "280GSM COMPACT COTTON. UNFINISHED SEAMS. RELAXED ARCHITECTURAL BOX CUT.",
        price: 1800,
        comparePrice: 2200,
        category: tops._id,
        tags: ["tee", "basic", "cotton"],
        featured: true,
        published: true,
        stock: 50,
        sku: "TOP-TE-002",
        images: ["/uploads/raw-edge-tee.jpg"],
        variants: [
          { size: "S", stock: 15, sku: "TOP-TE-002-S" },
          { size: "M", stock: 20, sku: "TOP-TE-002-M" },
          { size: "L", stock: 15, sku: "TOP-TE-002-L" }
        ]
      },
      {
        name: "INDUSTRIAL MOCKNECK",
        slug: "industrial-mockneck",
        description: "THERMAL WAFFLE KNIT. HIGHER COLLAR. CONTRAST FLATLOCK STITCHING.",
        price: 2400,
        comparePrice: 3000,
        category: tops._id,
        tags: ["mockneck", "thermal", "knit"],
        featured: false,
        published: true,
        stock: 12,
        sku: "TOP-MN-003",
        images: ["/uploads/mockneck.jpg"],
        variants: [
          { size: "S", stock: 3, sku: "TOP-MN-003-S" },
          { size: "M", stock: 4, sku: "TOP-MN-003-M" },
          { size: "L", stock: 5, sku: "TOP-MN-003-L" }
        ]
      },
      {
        name: "VOID LOGO TEE",
        slug: "void-logo-tee",
        description: "SCREENPRINTED TEXT GRAPHIC ON THE BACK. HIGH COLLAR. HEAVYWEIGHT COMBED COTTON.",
        price: 1900,
        comparePrice: 2400,
        category: tops._id,
        tags: ["tee", "graphic", "logo"],
        featured: false,
        published: true,
        stock: 0, // SOLD OUT product
        sku: "TOP-TE-004",
        images: ["/uploads/void-logo-tee.jpg"],
        variants: [
          { size: "S", stock: 0, sku: "TOP-TE-004-S" },
          { size: "M", stock: 0, sku: "TOP-TE-004-M" },
          { size: "L", stock: 0, sku: "TOP-TE-004-L" }
        ]
      },

      // BOTTOMS (4 products)
      {
        name: "WIDE CARGO PANTS",
        slug: "wide-cargo-pants",
        description: "MILITARY-SPEC COTTON RIPSTOP. ADJUSTABLE ANKLE TIES. TUCKED DOUBLE KNEE PANELS.",
        price: 3600,
        comparePrice: 4800,
        category: bottoms._id,
        tags: ["cargo", "ripstop", "bottoms"],
        featured: true,
        published: true,
        stock: 18,
        sku: "BOT-CG-001",
        images: ["/uploads/wide-cargo.jpg"],
        variants: [
          { size: "S", stock: 4, sku: "BOT-CG-001-S" },
          { size: "M", stock: 6, sku: "BOT-CG-001-M" },
          { size: "L", stock: 5, sku: "BOT-CG-001-L" },
          { size: "XL", stock: 3, sku: "BOT-CG-001-XL" }
        ]
      },
      {
        name: "HEAVY DENIM TROUSER",
        slug: "heavy-denim-trouser",
        description: "14OZ RIGID DENIM. EXTRA WIDE DRAPE. STONEWASHED IRON GREY FINISH.",
        price: 4200,
        comparePrice: 5500,
        category: bottoms._id,
        tags: ["denim", "trouser", "heavyweight"],
        featured: false,
        published: true,
        stock: 8, // Low-stock product
        sku: "BOT-DN-002",
        images: ["/uploads/denim-trouser.jpg"],
        variants: [
          { size: "M", stock: 5, sku: "BOT-DN-002-M" },
          { size: "L", stock: 3, sku: "BOT-DN-002-L" }
        ]
      },
      {
        name: "TACTICAL NYLON SHORTS",
        slug: "tactical-nylon-shorts",
        description: "WATER-RESISTANT MATTE NYLON. EMBEDDED FIDLOCK WEBBING BELT. CARGO ZIP POCKETS.",
        price: 2600,
        comparePrice: 3200,
        category: bottoms._id,
        tags: ["shorts", "nylon", "tactical"],
        featured: false,
        published: true,
        stock: 30,
        sku: "BOT-SH-003",
        images: ["/uploads/tactical-shorts.jpg"],
        variants: [
          { size: "S", stock: 10, sku: "BOT-SH-003-S" },
          { size: "M", stock: 12, sku: "BOT-SH-003-M" },
          { size: "L", stock: 8, sku: "BOT-SH-003-L" }
        ]
      },
      {
        name: "BRUTALIST SWEATPANTS",
        slug: "brutalist-sweatpants",
        description: "480GSM COTTON FLEECE. NO DRAWCORD. CLEAN INTEGRATED ELASTIC WAISTBAND.",
        price: 2900,
        comparePrice: 3800,
        category: bottoms._id,
        tags: ["sweatpants", "fleece", "cozy"],
        featured: false,
        published: true,
        stock: 14,
        sku: "BOT-SW-004",
        images: ["/uploads/brutalist-sweats.jpg"],
        variants: [
          { size: "S", stock: 3, sku: "BOT-SW-004-S" },
          { size: "M", stock: 5, sku: "BOT-SW-004-M" },
          { size: "L", stock: 6, sku: "BOT-SW-004-L" }
        ]
      },

      // OUTERWEAR (4 products)
      {
        name: "CARGO SHELL JACKET",
        slug: "cargo-shell-jacket",
        description: "3-LAYER WATERPROOF MEMBRANE. SEAM-SEALED ZIPPERS. COMPARTMENTAL CARGO STORAGE SYSTEM.",
        price: 7200,
        comparePrice: 9500,
        category: outerwear._id,
        tags: ["jacket", "shell", "waterproof"],
        featured: true,
        published: true,
        stock: 10,
        sku: "OUT-JK-001",
        images: ["/uploads/cargo-shell.jpg"],
        variants: [
          { size: "S", stock: 2, sku: "OUT-JK-001-S" },
          { size: "M", stock: 4, sku: "OUT-JK-001-M" },
          { size: "L", stock: 3, sku: "OUT-JK-001-L" },
          { size: "XL", stock: 1, sku: "OUT-JK-001-XL" }
        ]
      },
      {
        name: "MA-1 BOMBER JACKET",
        slug: "ma-1-bomber-jacket",
        description: "REINFORCED SATIN NYLON. MATTE BLACK HARDWARE. INSULATED WOOL LINING.",
        price: 5800,
        comparePrice: 7500,
        category: outerwear._id,
        tags: ["bomber", "jacket", "nylon"],
        featured: false,
        published: true,
        stock: 4, // Low-stock product
        sku: "OUT-BM-002",
        images: ["/uploads/ma1-bomber.jpg"],
        variants: [
          { size: "M", stock: 2, sku: "OUT-BM-002-M" },
          { size: "L", stock: 2, sku: "OUT-BM-002-L" }
        ]
      },
      {
        name: "RAW WORK JACKET",
        slug: "raw-work-jacket",
        description: "16OZ REINFORCED CANVAS. CORDUROY COLLAR DETAIL. ADJUSTABLE WAIST SNAPS.",
        price: 4800,
        comparePrice: 6200,
        category: outerwear._id,
        tags: ["canvas", "jacket", "workwear"],
        featured: false,
        published: true,
        stock: 15,
        sku: "OUT-WK-003",
        images: ["/uploads/work-jacket.jpg"],
        variants: [
          { size: "S", stock: 3, sku: "OUT-WK-003-S" },
          { size: "M", stock: 7, sku: "OUT-WK-003-M" },
          { size: "L", stock: 5, sku: "OUT-WK-003-L" }
        ]
      },
      {
        name: "DOWN COAT V2",
        slug: "down-coat-v2",
        description: "800-FILL GOOSE DOWN. RIPSTOP NYLON SHELL. MAGNETIC STORM FLAP OVER COMPACT ZIPPER.",
        price: 8500,
        comparePrice: 11000,
        category: outerwear._id,
        tags: ["down", "coat", "winter"],
        featured: false,
        published: true,
        stock: 3, // Low-stock product
        sku: "OUT-DN-004",
        images: ["/uploads/down-coat.jpg"],
        variants: [
          { size: "M", stock: 2, sku: "OUT-DN-004-M" },
          { size: "L", stock: 1, sku: "OUT-DN-004-L" }
        ]
      }
    ];

    const seededProducts = await Product.create(productsData);
    console.log(`Seeded ${seededProducts.length} products.`);

    console.log("Seeding reviews...");
    const reviewsData = [
      {
        user: customer._id,
        product: seededProducts[0]._id, // OS-V1 Hoodie
        rating: 5,
        body: "THE WEIGHT IS PERFECT. A TRUE SOLID PIECE."
      },
      {
        user: customer._id,
        product: seededProducts[1]._id, // Raw Edge Tee
        rating: 4,
        body: "GOOD COLLAR HEIGHT. FABRIC FEELS BULLETPROOF."
      },
      {
        user: customer._id,
        product: seededProducts[4]._id, // Wide Cargo Pants
        rating: 5,
        body: "DURABLE RIPSTOP COAT. BEST FIT IN MY ARCHIVE."
      },
      {
        user: customer._id,
        product: seededProducts[8]._id, // Cargo Shell Jacket
        rating: 5,
        body: "ENTIRELY SEAM-SEALED. SURVIVES REAL RAIN."
      },
      {
        user: customer._id,
        product: seededProducts[9]._id, // MA-1 Bomber
        rating: 3,
        body: "VERY WARM BUT A BIT BOXIER THAN I PREFER."
      }
    ];

    await Review.create(reviewsData);
    console.log("Seeded reviews successfully.");

    console.log("Seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
