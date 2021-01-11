'use strict';
const userModel = require('../../models/schema.user');
const httpErrors = require('http-errors');

const addUser = async (req, res, next) => {
    try {
        const { userName, password } = req.body;
        if (!userName || !password) throw httpErrors.BadRequest();
        
        const doesExist = await userModel.findOne({ 'userName': userName, 'isActive': 1 });
        if (doesExist) throw httpErrors.Conflict(`${userName} is already exists!`);

        const user = new userModel(req.body);
        const result = await user.save();
        res.send({ status: 200, msg: 'Saved Successfully!', data: result.id });
    } catch(err) {
        next(err);
    }
};

module.exports = { addUser };