const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load Playlist model
const Playlist = require('../models/Playlist');
const { ensureAuthenticated } = require('../config/auth');

// Upload Page
router.get('/create', ensureAuthenticated, (req, res) => res.render('createplaylist'));

router.post('/create', (req, res) => {
  const { title } = req.body;
  let errors = [];

  if (!title) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {
    res.render('', {
      errors, title
    });
  } else {
    // create playlist
  }

});

// query methods

module.exports = router;