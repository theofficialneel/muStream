const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Music'
  }],
  album_art: {
    type: String
  },
  uploaded_date: {
    type: Date,
    default: Date.now
  }
});

const Album = mongoose.model('Album', AlbumSchema);

module.exports = Album;
