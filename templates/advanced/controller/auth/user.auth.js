'use strict';
const passport = require('passport');
const httpErrors = require('http-errors');

const login = async (req, res, next) => {
    try {
        passport.authenticate('local', async (result) => {
            if (result.status === 200) {
                res.send(result);
            } else {
                next(result);
            }
        })(req, res, next);
    } catch (err) {
        next(httpErrors.InternalServerError());
    }
};

module.exports = { login };

