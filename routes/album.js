const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const path = require('path');
const multer = require('multer');
const fs = require('fs-extra');
const mongoose = require('mongoose');


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    let path = `./media/album/`;
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

// Load models
const Playlist = require('../models/Playlist');
const Album = require('../models/Album');
const Music = require('../models/Music');
const User = require('../models/User');

const { ensureAuthenticated } = require('../config/auth');


// Upload Page
router.get('/create', ensureAuthenticated, (req, res) => 
  res.render('createalbum', {
    user: req.user,
    subtitle: "Create Album"
  }));

router.post('/create', ensureAuthenticated, upload.single("art"), (req, res) => {

  let errors = [];

  const { title } = req.body;
  if (!title) {
    errors.push({ msg: 'Please enter all fields' });
    fs.remove(req.file.path);
    return res.render('createalbum', {
      errors, title,
      user: req.user,
      subtitle: "Create Album"
    });
  }

  const album = new Album({
    _id: new mongoose.Types.ObjectId(),
    artist: req.user._id,
    album_art: req.file.path,
    title: req.body.title
  });

  return album
    .save()
    .then(result => {
      req.flash(
        'success_msg',
        'Album created successfully'
      );
      return res.redirect('/dashboard');
    }).catch(err => {
      console.log(err);
      errors.push({ msg: err });
      if (errors.length > 0) {
        console.log(errors)
        return res.render('createalbum', {
          errors, title,
          user: req.user,
          subtitle: "Create Album"
        });
      }
    })
});

// query methods

// Get songs from single album
router.get('/songs/:id', ensureAuthenticated, (req, res) => {
  let new_songs = [];
  let albumId = req.params.id;
  return Album
  .findById(albumId)
  .exec()
  .then(album => {
    album.songs.forEach(song_id => {
      Music
      .findById(song_id)
      .then(song => {
        let new_song = song;
        if(req.user.favorites.includes(song._id)) {
          new_song.is_favorite = true;
        } else {
          new_song.is_favorite = false;
        }
        
        new_song.album_art = (album.album_art) ? album.album_art : "/assets/Napster.jpeg";
        new_songs.push(new_song);
      })
    })

    return res.render('songs_dashboard', {
      user: req.user,
      subtitle: "Home",
      dashboard_title: album.title,
      songs: new_songs
    })
  })
  .catch(err => {
    console.log(err);
    req.flash(
      'error_msg',
      'Album could not be retrieved'
    );
    return res.redirect('/dashboard');
  });
});

// Get list of albums
router.get('/list/:artist_id', ensureAuthenticated, (req, res) => {
  let artistId = req.params.artist_id;
  return Album
  .find({artist: mongoose.Types.ObjectId(artistId)})
  .exec()
  .then(albums => {
    let card_list = albums;
    return User
    .findById(artistId)
    .exec()
    .then(artist => {
      return res.render('card_dashboard', {
        user: req.user,
        subtitle:  "Home",
        dashboard_title: `Albums by ${artist.name}`,
        card_list: card_list
      })
    });
  })
  .catch(err => {
    console.log(err);
    req.flash(
      'error_msg',
      'Playlists could not be retrieved'
    );
    return res.redirect('/dashboard');
  });
})

module.exports = router;