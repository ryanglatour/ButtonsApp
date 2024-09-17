const express = require('express');
const router = express.Router();
const logsUpload = require('./logsupload'); 
const leaderboard = require('./leaderboardcontroller')

router.post('/upload', logsUpload.uploadFile);

router.post('/getLeaderboard', leaderboard.getLeaderboard)

router.post('/addToLeaderboard', leaderboard.addToLeaderboard)

module.exports = router;