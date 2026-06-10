const express = require("express");
const { 
  register, 
  login, 
  me, 
  addAddress, 
  updateAddress, 
  deleteAddress,
  forgotPassword,
  resetPassword 
} = require("../controller/auth.controller");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.post("/address", protect, addAddress);
router.put("/address/:id", protect, updateAddress);
router.delete("/address/:id", protect, deleteAddress);

module.exports = router;
