const express = require('express');
const { getAllMessages } = require('../models/messageModel');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const messages = await getAllMessages();
    const user = req.user; 
    res.render('index', { title: 'Home', messages, user });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load manuscripts. Try again later.');
    res.render('index', { title: 'Home', messages: [], user: req.user });
  }
});

module.exports = router;
