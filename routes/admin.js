const express = require('express');
const { body, validationResult } = require('express-validator');
const {  updateAdminStatus } = require('../models/userModel');
require('dotenv').config();

const router = express.Router();


// GET Admin Page
router.get('/become-admin', (req, res) => {
  if (!req.user) return res.redirect('/login');
  res.render('admin/become-admin', { title: 'Become Admin', errors: [] });
});

// POST Admin Form
router.post('/become-admin',
  body('adminCode').trim().equals(process.env.ADMIN_SECRET).withMessage('Incorrect code. Try again.'),
  async (req, res) => {
    const errors = validationResult(req);

    if (!req.user) {
      return res.redirect('/login');
    }

    if (!errors.isEmpty()) {
      return res.render('admin/become-admin', { title: 'Become Admin', errors: errors.array() });
    }

    try {
      await updateAdminStatus(req.user.id);
      req.flash('success', 'You have become an Admin.');
      res.redirect('/');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Failed to update admin status.');
      res.redirect('/');
    }
  }
);

module.exports = router;
