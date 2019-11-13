const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const dbURI = require('../config/keys').mongoURI;
// Load Music model
const Music = require('../models/Music');
const Album = require('../models/Album');
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
    user: req.user,
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
			return Album
				.findOneAndUpdate({title: album})
				.exec()
				.then(albumRetrived =>{
					if(albumRetrived){
						console.log("Album");
						console.log(albumRetrived);
						console.log("FileUploaded");
						console.log(req.file.filename);
						let songID = new mongoose.Types.ObjectId;
						albumRetrived.songs.push(songID)
						albumRetrived.save()
							.then(result =>{
								console.log(result);
								console.log("Album updated");
								req.flash(
								'success_msg',
								'Album updated successfully'
							)
							.catch(err => {
								console.log(err);
								req.flash(
									'error_msg',
									'Error in Album Upload'
								);
								return res.redirect('/dashboard');
							});
						});
						const song = new Music({
							_id: songID,
							title: title,
							artist: req.user._id,
							album: albumRetrived._id,
							genre: genre,
							filename: req.file.filename,
						});
						
						song.save()
							.then(result => {
								console.log("Song save success");
								req.flash(
									'success_msg',
									'Song uploaded successfully'
								);
								return res.redirect('/dashboard');
							})
							.catch(err =>{
								console.log(err);
								errors.push({msg: 'Song Model Upload Failed'});
								req.flash(
									'error_msg',
									'Song upload failed'
								);
								return res.redirect('/dashboard');
							});
					}
					else{
						//generate new album
						errors = [];
						errors.push({msg: 'Album not created. Please Create Album'});
						return res.render('createalbum', {
							errors, title,
							user: req.user,
							subtitle: "Create Album"
						  });

					}
				});
		}
	});
	
        
});

// query methods

module.exports = router;