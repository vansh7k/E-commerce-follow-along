const User = require("../model/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "default_jwt_secret_key", {
    expiresIn: "30d",
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Make the first user an admin automatically for ease of testing
    const count = await User.countDocuments();
    const role = count === 0 ? "admin" : "customer";

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      addresses: [],
    });

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        addresses: user.addresses,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        addresses: user.addresses,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile info" });
  }
};

// Add Address
const addAddress = async (req, res) => {
  try {
    const { street, city, state, zipCode, country, isDefault } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // If setting as default, clear others
    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    const newAddress = { street, city, state, zipCode, country, isDefault: isDefault || false };
    user.addresses.push(newAddress);
    await user.save();

    res.status(200).json({ message: "Address added successfully", addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: "Error adding address", error: error.message });
  }
};

// Update Address
const updateAddress = async (req, res) => {
  try {
    const { street, city, state, zipCode, country, isDefault } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const address = user.addresses.id(req.params.id);
    if (!address) return res.status(404).json({ message: "Address not found" });

    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    address.street = street || address.street;
    address.city = city || address.city;
    address.state = state || address.state;
    address.zipCode = zipCode || address.zipCode;
    address.country = country || address.country;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await user.save();
    res.status(200).json({ message: "Address updated successfully", addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: "Error updating address", error: error.message });
  }
};

// Delete Address
const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Filter out the address
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id);
    await user.save();

    res.status(200).json({ message: "Address deleted successfully", addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: "Error deleting address", error: error.message });
  }
};

// Forgot Password Request
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User with this email does not exist" });
    }

    // Generate reset token (20 bytes hex)
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Set fields on user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour validity
    await user.save();

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetLink = `${clientUrl}/reset-password/${resetToken}`;

    // Mailer configuration check
    let transporter;
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }

    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"MAVERICK Archive" <noreply@maverick.com>`,
          to: user.email,
          subject: "Password Reset Request - MAVERICK",
          text: `You requested a password reset. Please click the following link to reset your password: ${resetLink}. This link expires in 1 hour.`,
          html: `
            <div style="background-color: #0a0a0a; color: #e8e2d9; padding: 40px; font-family: monospace; border: 1px solid #2a2a2a; max-width: 500px; margin: auto;">
              <h2 style="color: #c9440e; border-bottom: 1px solid #2a2a2a; padding-bottom: 10px; font-weight: normal; letter-spacing: 0.1em;">MAVERICK // ARCHIVE</h2>
              <p style="font-size: 14px; line-height: 1.6;">A password reset request was received for your account.</p>
              <p style="font-size: 14px; line-height: 1.6;">Click the button below to reset your password. This link is valid for 1 hour.</p>
              <div style="margin: 25px 0;">
                <a href="${resetLink}" style="display: inline-block; background-color: #c9440e; color: #e8e2d9; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 0; letter-spacing: 0.05em;">RESET PASSWORD</a>
              </div>
              <p style="font-size: 11px; color: #6b6460; border-top: 1px solid #2a2a2a; padding-top: 10px;">If you did not request this, please ignore this email.</p>
            </div>
          `,
        });
        return res.status(200).json({ message: "Password reset link sent to your email." });
      } catch (mailError) {
        console.error("Mail send error:", mailError);
        console.log(`[RESET LINK FALLBACK]: ${resetLink}`);
        return res.status(200).json({
          message: "Password reset token created. (Mailing failed, link logged to server console)",
          resetLink: process.env.NODE_ENV === "development" || !process.env.NODE_ENV ? resetLink : undefined,
        });
      }
    } else {
      // Dev mode console fallback
      console.log(`\n======================================================`);
      console.log(`[DEVELOPMENT PASSWORD RESET LINK]:`);
      console.log(resetLink);
      console.log(`======================================================\n`);
      return res.status(200).json({
        message: "Password reset link logged to server console (development mode).",
        resetLink: resetLink,
      });
    }
  } catch (error) {
    console.error("ForgotPassword error:", error);
    res.status(500).json({ message: "Forgot password request failed", error: error.message });
  }
};

// Reset Password Action
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "New password is required" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Password reset token is invalid or has expired." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful. You can now login with your new password." });
  } catch (error) {
    console.error("ResetPassword error:", error);
    res.status(500).json({ message: "Reset password failed", error: error.message });
  }
};

module.exports = { register, login, me, addAddress, updateAddress, deleteAddress, forgotPassword, resetPassword };
