const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const ACCESS_TTL  = process.env.ACCESS_TOKEN_TTL  || '15m';
const REFRESH_TTL = process.env.REFRESH_TOKEN_TTL || '7d';
const isProd = process.env.NODE_ENV === 'production';

const cookieOpts = {
  httpOnly: true,
  secure: isProd,                 // false on localhost
  sameSite: isProd ? 'none' : 'lax',
  path: '/auth/refresh',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const u = username.toLowerCase();
  const foundUser = await User.findOne({ username: u }).exec();
  if (!foundUser) {
    console.log('LOGIN FAIL: user not found:', u);
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (typeof foundUser.active === 'boolean' && !foundUser.active) {
    console.log('LOGIN FAIL: inactive user:', u);
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const hashed = foundUser.passwordHash ?? foundUser.password;
  if (!hashed) {
    console.log('LOGIN FAIL: no stored hash for:', u);
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const match = await bcrypt.compare(password, hashed);
  if (!match) {
    console.log('LOGIN FAIL: bad password for:', u);
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const accessToken = jwt.sign(
    { UserInfo: { username: foundUser.username, roles: foundUser.roles } },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TTL }
  );

  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TTL }
  );

  res.cookie('jwt', refreshToken, cookieOpts);
  return res.json({ accessToken });
});

// @desc Refresh
// @route GET /auth/refresh
// @access Public
const refresh = (req, res) => {
  const token = req.cookies?.jwt;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });

      const foundUser = await User.findOne({ username: decoded.username }).lean();
      if (!foundUser) return res.status(401).json({ message: 'Unauthorized' });

      const accessToken = jwt.sign(
        { UserInfo: { username: foundUser.username, roles: foundUser.roles } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: ACCESS_TTL }
      );

      res.json({ accessToken });
    })
  );
};

// @desc Logout
// @route POST /auth/logout
// @access Public
const logout = (_req, res) => {
  res.clearCookie('jwt', { ...cookieOpts, maxAge: undefined });
  res.status(204).end();
};

module.exports = { login, refresh, logout };
