const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profile_image: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  playlists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist'
  }],
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Music'
  }]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
