'use strict';

const express = require('express');
const router = express.Router();

router.get('/service/users', async (req, res) => {
    try {
        res.send('Users API router..');
    } catch(err) {
        console.log(err);
    }
});

module.exports = router;