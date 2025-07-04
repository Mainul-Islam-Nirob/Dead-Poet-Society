const express = require('express');
const { getAllMessages } = require('../models/messageModel');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const messages = await getAllMessages();
    const user = req.user;  // may be undefined
    res.render('index', { title: 'Home', messages, user });
  } catch (err) {
    console.error(err);
    res.render('index', { title: 'Home', messages: [], user: req.user });
  }
});

module.exports = router;
