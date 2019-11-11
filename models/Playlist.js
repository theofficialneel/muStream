const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Music'
  }],
  playlist_art: {
    type: String,
    required: false
  },
  last_updated: {
    type: Date,
    default: Date.now
  }
});

const Playlist = mongoose.model('Playlist', PlaylistSchema);

module.exports = Playlist;