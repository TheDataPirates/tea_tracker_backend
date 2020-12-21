const {validationResult} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signup = async (req, res, next) => {
    const errors = validationResult(req); //this will get errors in validation middleware
    if (!errors.isEmpty()) {
        const error = new Error("User already exists !");
        error.statusCode = 422;
        error.data = errors.array();
        next(error);
    } else {
        const {user_id, password, name, dob, user_type, telephone_no, nic, address} = req.body;

        const hashedpw = await bcrypt.hash(password, 8).catch((err) => {
            //hashing enterd pw and store it db, hashing cannot turn back previous values
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
        await User.create({
            user_id: user_id,
            password: hashedpw,
            name: name,
            dob: dob,
            user_type: user_type,
            telephone_no: telephone_no,
            nic: nic,
            address: address,
            image: req.file.path //storing image path uploads/images/...
        });
        console.log("User saved");
        res.status(200).json({message: "User created"});
    }
};

exports.login = async (req, res, next) => {
    const userid = req.body.user_id;
    const password = req.body.password;
    let loadedUser;
    const user = await User.findOne({where: {user_id: userid}}).catch(
        (err) => {
            //check network failures
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    );
    if (!user) {
        const error = new Error("user with this id could not be found");
        error.statusCode = 400;
        next(error);
    } else {
        loadedUser = user;
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error("Wrong password!");
            error.statusCode = 400;
            next(error);
        } else {
            const token = jwt.sign(
                //genarate token and send back to user,token includes userid & fname
                {user_id: loadedUser.user_id, name: loadedUser.fname},
                "thisisatokenid",
                {expiresIn: "1 day"}
            );
            res.status(200).json({token: token, userId: loadedUser.user_id});
        }
    }
};
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

exports.getUser = async (req, res, next) => {
    const user_id = req.params.userId;
    try {
        const allUsers = await User.findAll({where: {user_id}});
        res.status(200).json({
            user: allUsers,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
exports.updateUser = async (req, res, next) => {
    const {user_id, password, name, dob, user_type, telephone_no, nic, address} = req.body;
    console.log(user_id);

    const hashedpw = await bcrypt.hash(password, 8).catch((err) => {
        //hashing enterd pw and store it db, hashing cannot turn back previous values
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });

    try {
        await User.update(
            {
                user_id,
                password: hashedpw,
                name,
                dob,
                user_type,
                telephone_no,
                nic,
                address
            },
            {
                where: {
                    user_id
                },
            }
        );
        res.status(200).json({
            message: "ok",
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.deleteUser = async (req, res, next) => {
    const user_id = req.params.userId;

    let user = await User.destroy({ where: { user_id } }).catch((err) => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
    if (!user) {
        console.log("user not found");
        res.status(500).json({ message: "user not found" });
    } else {
        res.status(200).json({
            user: "Deleted",
        });
    }
};