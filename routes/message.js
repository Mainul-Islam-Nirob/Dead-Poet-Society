const express = require('express');
const { deleteMessageById, createMessage, getMessageById } = require('../models/messageModel');

const router = express.Router();

// Middleware to ensure logged in
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}


function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    return next();
  }
  res.redirect('/');
}


// GET: Pen a Manuscript
router.get('/manuscript/new', ensureAuthenticated, (req, res) => {
  res.render('message/new-manuscript', { title: 'Pen a Manuscript', errors: [], oldInput: {} });
});

// POST: Submit Manuscript
router.post('/manuscript/new', ensureAuthenticated, async (req, res) => {
  const { title, body } = req.body;

  if (!title || !body) {
    return res.render('message/new-manuscript', { 
      title: 'Pen a Manuscript', 
      errors: [{ msg: 'All fields are required.' }],
      oldInput: req.body
    });
  }

  try {
    await createMessage(title, body, req.user.id);
    req.flash('success', 'Your manuscript has been penned.');
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('message/new-manuscript', { 
      title: 'Pen a Manuscript', 
      errors: [{ msg: 'Something went wrong.' }],
      oldInput: req.body
    });
  }
});


// Single Manuscript View Route
router.get('/manuscript/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const message = await getMessageById(id);

    if (!message) {
      req.flash('error', 'Manuscript not found.');
      return res.redirect('/');
    }

    const showAuthor = req.user && (req.user.is_member || req.user.id === message.author_id || req.user.is_admin);

    res.render('message/detail', {
      title: message.title,
      message,
      showAuthor
    });

  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load manuscript.');
    res.redirect('/');
  }
});

router.post('/manuscript/:id/delete', ensureAdmin, async (req, res) => {
  try {
    await deleteMessageById(req.params.id);
    req.flash('success', 'Manuscript erased from history.');
    res.redirect('/');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not delete manuscript.');
    res.redirect('/');
  }
});



module.exports = router;
