const express = require('express');

const fileController = require('../controllers/FileController');

const router = express.Router();

router.get('/', function (req, res, next) {
    res.status(200).json('Welcome to file comparison API');
});

router.post('/upload', fileController.handleUpload);

module.exports = router;
