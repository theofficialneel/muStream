const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const mongoose = require("mongoose");
const User = require('../models/User');
const Music = require('../models/Music');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => {
    res.render('welcome', {
        subtitle: "Home"
    });
});

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    console.log(req.user);
    let new_songs = [];
    Music
    .find({artist: mongoose.Types.ObjectId(req.user._id)})
    .then(result => {
        console.log(result);
        result.forEach(song => {
            let new_song = song;
            if(req.user.favorites.includes(song._id)) {
                new_song.is_favorite = true;
            } else {
                new_song.is_favorite = false;
            }

            Album
            .findById(song.album)
            .then(album => {
                new_song.album_art = (album.album_art) ? album.album_art : "/assets/Napster.jpeg";
                new_songs.push(new_song);
            })
            .catch(err => {
                console.log(err)
            });
        });
        res.render('songs_dashboard', {
            user: req.user,
            subtitle: "Home",
            dashboard_title: "My Songs",
            songs: new_songs
        })
    })
    .catch(err => {
        console.log(err);
    });
});

module.exports = router;
