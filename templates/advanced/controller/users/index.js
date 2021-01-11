'use strict';
const express = require('express');
const router = express.Router();
const add = require('./create.users');

router.post('/addUser', add.addUser);

module.exports = router;