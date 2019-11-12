const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const path = require('path');
const multer = require('multer');

// Multer Storage
const storage = multer.diskStorage({
  destination: './media/album/',
  filename: (req, file, cb) => {
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init upload 
const upload = multer({
  storage: storage
}).single('art');

// Load Album model
const Album = require('../models/Album');
const { ensureAuthenticated } = require('../config/auth');

// Upload Page
router.get('/create', ensureAuthenticated, (req, res) => 
  res.render('createalbum', {
    user: req.user,
    subtitle: "Create Album"
  }));

router.post('/create', (req, res) => {
  
  let errors = [];

  const { title } = req.body;

  if (!title) {
    errors.push({ msg: 'Please enter all fields' });
    return res.render('createalbum', {
      errors, title,
      user: req.user,
      subtitle: "Create Album"
    });
  }

  upload(req, res, (err) => {
    if(err) {
      errors.push({ msg: 'Please enter all fields' });
    }

    if (errors.length > 0) {
      res.render('createalbum', {
        errors, title,
        user: req.user,
        subtitle: "Create Album"
      });
    } else {
      console.log(req.file)
      req.flash(
        'success_msg',
        'Album created successfully'
      );
      res.redirect('/album/createalbum');
    }
  })
});

// query methods

module.exports = router;