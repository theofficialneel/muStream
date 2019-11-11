const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load Album model
const Album = require('../models/Album');
const { ensureAuthenticated } = require('../config/auth');



module.exports = router;