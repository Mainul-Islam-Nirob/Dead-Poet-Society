const express = require('express');
const { getAllUsersWithPostCount } = require('../models/userModel');
const router = express.Router();

// Middleware: Only logged-in users can view this
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash('error', 'You must be logged in to view this page.');
  res.redirect('/login');
}

// GET User Records Page
router.get('/user-records', ensureAuthenticated, async (req, res) => {
  try {
    const users = await getAllUsersWithPostCount();
    res.render('users/records', { title: 'User Records', users });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load user records.');
    res.redirect('/');
  }
});

module.exports = router;
