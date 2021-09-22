const express = require('express');
const path = require('path');
const logger = require('morgan');
const fs = require('fs');

const indexRouter = require('./routes');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../build')));

app.use('/api', indexRouter);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});

module.exports = app;
