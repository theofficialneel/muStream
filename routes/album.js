const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load Album model
const Album = require('../models/Album');
const { ensureAuthenticated } = require('../config/auth');

// Upload Page
router.get('/create', ensureAuthenticated, (req, res) => 
  res.render('createalbum', {
    subtitle: "Create Album"
  }));

router.post('/create', (req, res) => {
  const { title } = req.body;
  let errors = [];

  if (!title) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {
    res.render('createalbum', {
      errors, title
    });
  } else {
    // create album
  }

});

// query methods

module.exports = router;