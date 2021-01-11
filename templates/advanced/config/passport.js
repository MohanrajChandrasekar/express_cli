'use strict';
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userModel = require('../models/schema.user');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, 
    async (username, password, done) => {
        const user = await userModel.findOne({ 'userName': username });
        if (user === undefined || user === null) {
            return done({ status: 500, message: "user account not found!" });
        } else {
            if (user.isLocked) { // continious three time wrong password attempts.
                return done({ status: 423, message: "User account locked, please contact admin!" });
            } else {
                const match = await bcrypt.compare(password, user.password);
                if (match) { // login success call.
                    const token = JWT.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
                    return done({ status: 200, message: "LoggedIn Successfully!", accessToken: token });
                } else { // incorrect password call.
                    await updateFailureCount(user);
                    return done({ status: 401, message: "Incorrect Password!" });
                }
            }
        }
    })
)

async function updateFailureCount(user) { // function to update that the user attempts wrong password.
    const failedCount = user.failedAttemptCount;
    if (failedCount === 2) {
        await userModel.updateOne({ '_id': user._id }, {
            $set: {
                isLocked: true,
                failedAttemptCount: failedCount + 1
            }
        });
    } else if (failedCount < 2) {
        await userModel.updateOne({ '_id': user._id }, {
            $set: {
                failedAttemptCount: failedCount + 1
            }
        });
    }
    return true;
}


