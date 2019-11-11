const mongoose = require('mongoose');

const MusicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  album: {
    type: String,
    required: false
  },
  genre: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Music = mongoose.model('Music', MusicSchema);

module.exports = Music;
