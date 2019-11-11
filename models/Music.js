const mongoose = require('mongoose');

const MusicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  artist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    required: true
  },
  genre: [{
    type: String,
    enum: ['Pop', 'Hip-hop', 'Folk', 'Country', 'Indie', 'Classical', 'EDM', 'Rock', 'Metal', 'Jazz', 'Funk', 'Disco', 'Reggae', 'Rap', 'Alt Rock']
  }],
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
