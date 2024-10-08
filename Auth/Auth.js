const bcrypt = require("bcryptjs")
// The user schema
const User = require("../Schemas/User")

// User authentication with JSON Web Token
const jwt = require('jsonwebtoken')
require('dotenv').config()
const jwtSecret = process.env.JWT_SECRET;

// Register function
exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (password.length < 6) {
    return res.status(400).json({ message: "Password should be at least 6 characters long" });
  }
  
  try {
    const hash = await bcrypt.hash(password, 10); // Hash the password asynchronously
    const user = await User.create({
      name,
      email,
      password: hash,
    });

    const maxAge = 3 * 60 * 60; // 3 hours in seconds
    const token = jwt.sign(
      { id: user._id, name },
      jwtSecret,
      { expiresIn: maxAge }
    );

    res.cookie("jwt", token, {
      path: '/',
      httpOnly: true,
      maxAge: maxAge * 1000, // 3 hours in milliseconds
    });
    
    res.status(201).json({
      message: "User successfully created",
      user: user._id,
    });
  } catch (error) {
    res.status(400).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Login function
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Login not successful, email or password not present",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Login not successful, wrong email or password",
      });
    }

    // comparing given password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const maxAge = 3 * 60 * 60; // 3 hours in seconds
      const token = jwt.sign(
        { id: user._id, username: user.name },
        jwtSecret,
        { expiresIn: maxAge }
      );

      res.cookie("jwt", token, {
        path: '/',
        httpOnly: true,
        maxAge: maxAge * 1000, // Convert to milliseconds
      });

      res.status(201).json({
        message: "User successfully logged in",
        user: user._id,
      });
    } else {
      res.status(400).json({ message: "Login not successful, wrong email or password" });
    }
  } catch (error) {
    res.status(400).json({
      message: "An internal server error occurred",
      error: error.message,
    });
  }
};

exports.logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 }); // Set the jwt cookie to expire immediately
  res.status(200).json({ message: 'Logged out successfully' });
};

// Checks if the user is logged in or an admin, for rendering content
exports.userStatus = async (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        return res.json({ isAuthenticated: false })
      } else {
        return res.json({ isAuthenticated: true })
      }
    })
  } else {
    return res
      .json({ isAuthenticated: false })
  }
}