const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.ACCESS_TOKEN_SECRET || 'taskplanet_access_token_secret_key_3w_internship_2026',
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m' }
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET || 'taskplanet_refresh_token_secret_key_3w_internship_2026',
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
  );
};

// @desc Register user
// @route POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, username, email, password, badge } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const cleanUsername = username.startsWith('@') ? username.slice(1).toLowerCase() : username.toLowerCase();

    // Check if email or username already exists
    const userExists = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: cleanUsername }],
    });

    if (userExists) {
      if (userExists.email === email.toLowerCase()) {
        return res.status(400).json({ message: 'Email is already registered' });
      }
      return res.status(400).json({ message: 'Username is already taken' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Random avatar placeholder or initials generator
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`;

    const user = await User.create({
      name,
      username: `@${cleanUsername}`,
      email: email.toLowerCase(),
      password: hashedPassword,
      badge: badge || 'Legend',
      avatar,
    });

    // Generate Tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to user model
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        badge: user.badge,
        avatar: user.avatar,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// @desc Login user
// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ message: 'Please provide email/username and password' });
    }

    const searchValue = emailOrUsername.toLowerCase().trim();
    const cleanUsername = searchValue.startsWith('@') ? searchValue : `@${searchValue}`;

    const user = await User.findOne({
      $or: [{ email: searchValue }, { username: cleanUsername }, { username: searchValue }],
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate Tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        badge: user.badge,
        avatar: user.avatar,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// @desc Refresh Access Token
// @route POST /api/auth/refresh-token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Refresh Token is required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || 'taskplanet_refresh_token_secret_key_3w_internship_2026');
    } catch (err) {
      return res.status(403).json({ message: 'Invalid or expired Refresh Token' });
    }

    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: 'Refresh token revoked or mismatch' });
    }

    // Issue new tokens
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ message: 'Server error during token refresh', error: error.message });
  }
};

// @desc Logout user
// @route POST /api/auth/logout
const logout = async (req, res) => {
  try {
    if (req.user) {
      req.user.refreshToken = null;
      await req.user.save();
    }
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
};

// @desc Get current logged-in user profile
// @route GET /api/auth/me
const getMe = async (req, res) => {
  try {
    res.json({
      id: req.user._id,
      name: req.user.name,
      username: req.user.username,
      email: req.user.email,
      badge: req.user.badge,
      avatar: req.user.avatar,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getMe,
};
