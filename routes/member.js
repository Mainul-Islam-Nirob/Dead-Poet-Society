const express = require('express');
const { updateMembershipStatus } = require('../models/userModel');
const router = express.Router();

// Middleware to ensure user is logged in
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

// GET: Membership Page
router.get('/become-member', ensureAuthenticated, (req, res) => {
  res.render('member/become-member', { 
    title: 'Become a Member', 
    errors: [],
    success: []
  });
});

// POST: Membership Check
router.post('/become-member', ensureAuthenticated, async (req, res) => {
  const secretAnswer = req.body.secret.trim().toLowerCase();
  
  if (secretAnswer === 'tennyson') {
    await updateMembershipStatus(req.user.id, true);
    req.flash('success', 'Congratulations! You are now a Member.');
    res.redirect('/');
  } else {
    res.render('member/become-member', { 
      title: 'Become a Member',
      errors: [{ msg: 'Incorrect answer. Try again!' }],
      success: []
    });
  }
});

module.exports = router;
