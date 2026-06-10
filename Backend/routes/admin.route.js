const express = require("express");
const { getStats, getCustomers } = require("../controller/admin.controller");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get("/stats", getStats);
router.get("/customers", getCustomers);

module.exports = router;
