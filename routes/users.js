const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const mongoose = require("mongoose");
const User = require('../models/User');
const Music = require('../models/Music');
const Album = require('../models/Album');``


// Login Page
router.get('/login', forwardAuthenticated, (req, res) => 
  res.render('login', {
    subtitle: "Login"
}));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => 
  res.render('register', {
    subtitle: "Register"
  }));

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

router.get('/favorites', ensureAuthenticated, async(req, res) => {
  let new_songs = [];
  try{
    let favorite_songs = req.user.favorites;
    for(i in favorite_songs) {
      let song_id = favorite_songs[i];
      let song = await Music.findById(song_id)
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
      dashboard_title: "Favorites",
      songs: new_songs
    })
  } catch (err) {
    req.flash(
        'error_msg',
        'Favorites could not be retrieved'
      );
    return res.redirect('/dashboard');
  }
});

router.get('/favorites/add/:id', ensureAuthenticated, (req, res) => {
  let song_id = req.params.id;

  if(!song_id) {
    req.flash(
      'error_msg',
      "Cannot add null song"
    );
    return res.redirect('/dashboard'); 
  }
  let user_id = req.user._id;
  let updated_favourites = req.user.favorites;
  updated_favourites.push(song_id);
  console.log(user_id);
  return User
  .findOneAndUpdate(
   { _id: user_id},
   { favorites: updated_favourites },
   { new: true })
  .then(user => {
      console.log(user);
      req.flash(
        'success_msg',
        'Song added to favorites'
      );
      return res.redirect('/dashboard');
  })
  .catch(err => {
    console.log(err);
    req.flash(
      'error_msg',
      "Unable to add to favorites"
    );
    return res.redirect('/dashboard');
  });
});

module.exports = router;
