const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const mongoose = require("mongoose");
const User = require('../models/User');
const Music = require('../models/Music');
const Album = require('../models/Album');``

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => {
    console.log(req.user)
    res.render('welcome', {
        subtitle: "Home"
    });
});

// Dashboard
router.get('/dashboard', ensureAuthenticated, async(req, res) => {
    let new_songs = [];
    try{
        let result = await Music.find({artist: mongoose.Types.ObjectId(req.user._id)});
        for (i in result) {
            let song = result[i];
            let new_song = song.toObject();
            if(req.user.favorites.includes(song._id)) {
                new_song.is_favorite = true;
            } else {
                new_song.is_favorite = false;
            }

            let album = await Album.findById(song.album);
            album = album.toObject();
            new_song.album_art = (album.album_art) ? album.album_art : "/assets/Napster.jpeg";
            new_songs.push(new_song);
        }
        
        console.log(new_songs);
        return res.render('songs_dashboard', {
            user: req.user,
            subtitle: "Home",
            dashboard_title: "My Songs",
            songs: new_songs
        });
    } catch (err) {
        req.flash(
            'error_msg',
            'Songs could not be retrieved'
          );
        return res.redirect('/dashboard');
    }
});

router.post('/search', ensureAuthenticated, async(req, res) => {
    let new_songs = [];
    let search_string = req.body.song_search;
    var regexp = new RegExp("^"+ search_string);
    console.log(search_string)
    try{
        let result = await Music.find({title: regexp});
        for (i in result) {
            let song = result[i];
            let new_song = song.toObject();
            if(req.user.favorites.includes(song._id)) {
                new_song.is_favorite = true;
            } else {
                new_song.is_favorite = false;
            }

            let album = await Album.findById(song.album);
            album = album.toObject();
            new_song.album_art = (album.album_art) ? album.album_art : "/assets/Napster.jpeg";
            new_songs.push(new_song);
        }
        
        console.log(new_songs);
        return res.render('songs_dashboard', {
            user: req.user,
            subtitle: "Home",
            dashboard_title: "My Songs",
            songs: new_songs
        });
    } catch (err) {
        req.flash(
            'error_msg',
            'Songs could not be searched'
          );
        return res.redirect('/dashboard');
    }
});
module.exports = router;
