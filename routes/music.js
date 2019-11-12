const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const dbURI = require('../config/keys').mongoURI;
// Load Music model
const Music = require('../models/Music');
const { ensureAuthenticated } = require('../config/auth');

//DB connection
const connection = mongoose.createConnection(dbURI);
let gfs;

connection.once('open', () => {
	gfs = Grid(connection.db, mongoose.mongo);
	gfs.collection('tracks');
});

//Multer Setup
const storage = new GridFsStorage({
	url: dbURI,
	file: (req, file) => {
		const {title, album, genre} = req.body;
		const filename = title + '_' + album + '_' + Date.now();
		console.log(filename);
		return {filename: filename, bucketName: 'test'};
	}
});
const upload = multer({storage: storage})

// Upload Page
router.get('/upload', ensureAuthenticated, (req, res) => 
  res.render('upload', {
    subtitle: "Upload Music"
  }));


router.post('/upload', (req, res) => {

	upload.single('track')(req, res, (err) => {
		const {title, album, genre} = req.body;
		let errors = [];

		if (!title || !album || !genre) {
			errors.push({ msg: 'Please enter all fields' });
		}

        if(err){
            console.log('Error in upload');
            errors.push({msg: 'Upload Request Failed'});
		}

		if (errors.length > 0) {
			res.render('upload', {	
			errors, title, album, genre
			});
		}
		else{

			console.log('Upload Sucessful');
			res.redirect('/dashboard');
		}
	});
	
        
});

// query methods

module.exports = router;