const express = require('express');
const router = express.Router();
const logsUpload = require('./logsupload'); 
const leaderboard = require('./leaderboardcontroller')
const documents = require('./documentscontroller')

const multer = require('multer');
const upload = multer();


router.post('/upload', logsUpload.uploadFile);

router.post('/getLeaderboard', leaderboard.getLeaderboard)

router.post('/addToLeaderboard', leaderboard.addToLeaderboard)

router.post('/addDocument', upload.single('file'), documents.addDocument)

module.exports = router;