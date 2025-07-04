const express = require('express');
const { body, validationResult } = require('express-validator');
const {  updateAdminStatus, getAllUsers } = require('../models/userModel');
const { getAllMessages, deleteMessageById } = require('../models/messageModel');
require('dotenv').config();

const router = express.Router();

// Middleware to protect admin routes
function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) return next();
  req.flash('error', 'Access denied.');
  res.redirect('/');
}

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

// GET Admin Dashboard
router.get('/admin/dashboard', ensureAdmin, async (req, res) => {
  try {
    const messages = await getAllMessages();
    const users = await getAllUsers();
    res.render('admin/dashboard', { title: 'Admin Dashboard', messages, users });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load dashboard.');
    res.redirect('/');
  }
});

// DELETE Message (Reuse existing route or create here if needed)
router.post('/admin/manuscript/:id/delete', ensureAdmin, async (req, res) => {
  try {
    await deleteMessageById(req.params.id);
    req.flash('success', 'Manuscript deleted.');
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to delete.');
    res.redirect('/admin/dashboard');
  }
});

module.exports = router;
