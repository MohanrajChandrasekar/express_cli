'use strict';
const express = require('express');
const router = express.Router();
const userAuth = require('./user.auth');

router.post('/login', userAuth.login);

module.exports = router;