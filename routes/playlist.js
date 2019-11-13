const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const path = require('path');
const multer = require('multer');
const fs = require('fs-extra');
const mongoose = require('mongoose');

// Multer Setup

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    let path = `./media/playlist/`;
    fs.mkdirsSync(path);
    cb(null, path);
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    //accept a file
    cb(null, true);
  } else {
    //reject a file
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024
  },
  fileFilter: fileFilter
});


// Load Playlist model
const Playlist = require('../models/Playlist');
const { ensureAuthenticated } = require('../config/auth');

// Upload Page
router.get('/create', ensureAuthenticated, (req, res) => 
  res.render('createplaylist', {
    user: req.user,
    subtitle: "Create Playlist"
}));

router.post('/create', ensureAuthenticated, upload.single("art"), (req, res) => {

  let errors = [];

  const { title } = req.body;
  if (!title) {
    errors.push({ msg: 'Please enter all fields' });
    fs.remove(req.file.path);
    return res.render('createplaylist', {
      errors, title,
      user: req.user,
      subtitle: "Create Playlist"
    });
  }

  const album = new Playlist({
    _id: new mongoose.Types.ObjectId(),
    creator: req.user._id,
    playlist_art: req.file.path,
    title: req.body.title
  });

  return album
    .save()
    .then(result => {
      req.flash(
        'success_msg',
        'Playlist created successfully'
      );
      return res.redirect('/dashboard');
    }).catch(err => {
      console.log(err);
      errors.push({ msg: err });
      if (errors.length > 0) {
        console.log(errors)
        return res.render('createplaylist', {
          errors, title,
          user: req.user,
          subtitle: "Create Playlist"
        });
      }
    })
});

// query methods

module.exports = router;