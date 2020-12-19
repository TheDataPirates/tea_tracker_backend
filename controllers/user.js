const User = require('../models/user');
const Sequelize = require("sequelize");

exports.getUsers = async (req, res, next) => {
    try {
        const allUsers = await User.findAll();
        res.status(200).json({
            users: allUsers,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};