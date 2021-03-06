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


// Load models
const Playlist = require('../models/Playlist');
const Album = require('../models/Album');
const Music = require('../models/Music');
const User = require('../models/User');

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

// Get songs from single playlist
router.get('/songs/:id', ensureAuthenticated, async(req, res) => {
  let new_songs = [];
  let playlistId = req.params.id;
  try{
    let playlist = await Playlist.findById(playlistId);
    for(i in playlist.songs) {
      let song_id = playlist.songs[i];
      let song = await Music.findById(song_id);
      let new_song = song.toObject();
      if(req.user.favorites.includes(song._id)) {
        new_song.is_favorite = true;
      } else {
        new_song.is_favorite = false;
      }

      let album = await Album.findById(song.album);
      new_song.album_art = (album.album_art) ? album.album_art : "/assets/Napster.jpeg";
      new_songs.push(new_song); 
    }

    return res.render('songs_dashboard', {
      user: req.user,
      subtitle: "Home",
      dashboard_title: playlist.title,
      songs: new_songs
    })

  } catch (err) {
    req.flash(
        'error_msg',
        'Playlist could not be retrieved'
      );
    return res.redirect('/dashboard');
  }
});

// Get list of playlists
router.get('/list/:creator_id', ensureAuthenticated, (req, res) => {
  let creatorId = req.params.creator_id;
  return Playlist
  .find({creator: mongoose.Types.ObjectId(creatorId)})
  .exec()
  .then(playlists => {
    let card_list = playlists;
    return User
    .findById(creatorId)
    .exec()
    .then(creator => {
      return res.render('card_dashboard', {
        user: req.user,
        subtitle:  "Home",
        dashboard_title: `Playlists by ${creator.name}`,
        card_type: "playlist",
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
});

router.get('/add/:song_id/:playlist', ensureAuthenticated, (req, res) => {
  let song_id = req.params.song_id;
  let playlist = req.params.playlist;

  if(!playlist) {
    req.flash(
      'error_msg',
      "Cannot add to null playlist"
    );
    return res.redirect('/dashboard'); 
  }
  return Playlist
  .update(
   { title: playlist},
   { $push: { songs: song_id } },
   { new: true })
  .then(playlist => {
      console.log(playlist);
      req.flash(
        'success_msg',
        'Song added to playlist'
      );
      return res.redirect('/dashboard');
  })
  .catch(err => {
    console.log(err);
    req.flash(
      'error_msg',
      "Unable to add to playlist"
    );
    return res.redirect('/dashboard');
  });
});

module.exports = router;