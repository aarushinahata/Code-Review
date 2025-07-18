const express = require('express');
const jwt = require('jsonwebtoken');
const Review = require('../models/review.model');
const User = require('../models/user.model');

const router = express.Router();

// Auth middleware
function auth(req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided.' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token.' });
  }
}

// Get review history for user
router.get('/history', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch history.' });
  }
});

// Save a review
router.post('/save', auth, async (req, res) => {
  try {
    const { code, review, model } = req.body;
    if (!code || !review || !model) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const newReview = new Review({ user: req.userId, code, review, model });
    await newReview.save();
    res.json(newReview);
  } catch (err) {
    res.status(500).json({ message: 'Failed to save review.' });
  }
});

module.exports = router; 