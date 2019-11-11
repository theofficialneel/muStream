const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load Music model
const Music = require('../models/Music');
const { ensureAuthenticated } = require('../config/auth');

// Upload Page
router.get('/upload', ensureAuthenticated, (req, res) =>
  res.render('upload', {
    user: req.user
  })
);

router.post('/upload', (req, res) => {
  const { title, artist, album, genre } = req.body;
  let errors = [];

  if (!title || !artist || !genre) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {
    res.render('upload', {
      errors, title, artist, album, genre
    });
  } else {
    // upload music file.
  }

});

module.exports = router;