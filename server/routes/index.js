const express = require('express');
const path = require('path');
const fs = require('fs');

const fileController = require('../controllers/FileController');

const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/upload', fileController.handleUpload);

module.exports = router;
