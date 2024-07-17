const express = require('express');
const router = express.Router();
const logsUpload = require('./logsupload'); 

router.post('/upload', logsUpload.uploadFile);

module.exports = router;