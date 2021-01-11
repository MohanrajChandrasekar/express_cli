'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isLocked: {
        type: Boolean,
        default: false
    },
    failedAttemptCount: {
        type: Number,
        default: 0
    },
    createdDate: {
        type: Date,
        default: Date.now()
    },
    createdBy: {
        type: String,
        required: true
    }
});

userSchema.pre('save', async function(next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch(err) {
        next(err);
    }
});

const model = mongoose.model('users', userSchema, 'users');
module.exports = model;