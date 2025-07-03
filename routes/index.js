const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Dead Poet Society' });
});

module.exports = router;
