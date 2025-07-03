const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { createUser, findUserByUsername } = require('../models/userModel');
const passport = require('passport');

const router = express.Router();

// GET Sign-Up Page
router.get('/signup', (req, res) => {
  res.render('auth/signup', { title: 'Join the Society', errors: [], oldInput: {} });
});

// POST Sign-Up Form
router.post('/signup',
  // Validate & Sanitize
  [
    body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required.'),
    body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required.'),
    body('username').isEmail().withMessage('Valid email required.')
      .custom(async (value) => {
        const user = await findUserByUsername(value);
        if (user) {
          throw new Error('Email already in use.');
        }
        return true;
      }),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match.');
      }
      return true;
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const { firstName, lastName, username, password } = req.body;

    if (!errors.isEmpty()) {
      return res.render('auth/signup', { title: "Join the Society", errors: errors.array(), oldInput: req.body });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await createUser(firstName, lastName, username, hashedPassword);
      req.flash('success', 'Sign-up successful. Please log in.');
      res.redirect('/login');
    } catch (err) {
      console.error(err);
      res.render('auth/signup', { title: "Join the Society", errors: [{ msg: 'Something went wrong. Try again.' }], oldInput: req.body });
    }
  }
);

// GET Login Page
router.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Login', errors: [], oldInput: {} });
});

// POST Login
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);


module.exports = router;
