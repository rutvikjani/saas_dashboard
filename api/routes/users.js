const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticate, requireAdmin } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

router.get('/', authenticate, requireAdmin, async (req, res) => {
  const users = await User.find().select('-password -refreshTokens');
  res.json(users);
});

router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, company, avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, company, avatar }, { new: true }).select('-password -refreshTokens');
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
