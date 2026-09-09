const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Create a signed JWT for a user id
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// Shape the user object we send back to the client (never the password)
const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide name, email and password" });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res
        .status(409)
        .json({ message: "An account with that email already exists" });
    }

    const user = await User.create({ name, email, password });

    return res.status(201).json({
      user: publicUser(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    // Surface mongoose validation messages nicely
    if (error.name === "ValidationError") {
      const msg = Object.values(error.errors)[0]?.message || "Invalid data";
      return res.status(400).json({ message: msg });
    }
    return res.status(500).json({ message: "Could not create account" });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate a user and return a token
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // password has select:false, so ask for it explicitly
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json({
      user: publicUser(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(500).json({ message: "Could not log in" });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get the currently logged-in user
 * @access  Private
 */
const getMe = async (req, res) => {
  return res.json({ user: publicUser(req.user) });
};

module.exports = { signup, login, getMe };
