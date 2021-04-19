const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const User = require("../models/user");
const templates = require("../email/email.templates");
const sendEmail = require("../email/email.send");
const msgs = require("../email/email.msgs");
const aleaRNGFactory = require("number-generator/lib/aleaRNGFactory");
const generator1 = aleaRNGFactory(2);

exports.signup = async (req, res, next) => {
    const errors = validationResult(req); //this will get errors in validation middleware
    if (!errors.isEmpty()) {
        const error = new Error("User already exists !");
        error.statusCode = 422;
        error.data = errors.array();
        next(error);
    } else {
        const { user_id, password, name, dob, user_type, telephone_no, nic, address } = req.body;
        let hashedpw = null;
        await bcrypt.genSalt(8, function (err, salt) {
            console.log(salt);
            bcrypt.hash(password, salt, function (err, hash) {
                if (err) {
                    next(err);
                }
                hashedpw = hash;
                console.log(hashedpw);
                // Store hash in your password DB.
            });
        });
        // const hashedpw = await bcrypt.hash(password, 8).catch((err) => {
        //     //hashing enterd pw and store it db, hashing cannot turn back previous values
        //     if (!err.statusCode) {
        //         err.statusCode = 500;
        //     }
        //     next(err);
        // });

        // await User.create({
        //     user_id: user_id,
        //     password: hashedpw,
        //     name: name,
        //     dob: dob,
        //     user_type: user_type,
        //     telephone_no: telephone_no,
        //     nic: nic,
        //     address: address,
        //     image: req.file.path //storing image path uploads/images/...
        // });
        try {
            switch (user_type) {
                case 'Agent':
                    await User.create({
                        user_id: `AG${generator1.uInt32()}`,
                        password: 'hashedpw',
                        name: name,
                        dob: dob,
                        user_type: user_type,
                        telephone_no: telephone_no,
                        nic: nic,
                        address: address,
                        image: req.file.path //storing image path uploads/images/...
                    });
                    break;
                case 'Officer':
                    await User.create({
                        user_id: `OF${generator1.uInt32()}`,
                        password: hashedpw,
                        name: name,
                        dob: dob,
                        user_type: user_type,
                        telephone_no: telephone_no,
                        nic: nic,
                        address: address,
                        image: req.file.path //storing image path uploads/images/...
                    });
                    break;
                case 'Admin':
                    await User.create({
                        user_id: `AD${generator1.uInt32()}`,
                        password: hashedpw,
                        name: name,
                        dob: dob,
                        user_type: user_type,
                        telephone_no: telephone_no,
                        nic: nic,
                        address: address,
                        image: req.file.path //storing image path uploads/images/...
                    });
                    break;
                default:
                    break;

            }
            console.log("User saved");
            res.status(200).json({message: "User created"});
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
        // console.log("User saved");
        // res.status(200).json({message: "User created"});
    }
};

exports.login = async (req, res, next) => {
    const userid = req.body.user_id;
    const password = req.body.password;
    let loadedUser;
    const user = await User.findOne({ where: { user_id: userid } }).catch(
        (err) => {
            //check network failures
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    );
    if (!user) {
        const error = new Error("Such user does not exist !!!");
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
                { user_id: loadedUser.user_id, name: loadedUser.fname },
                "thisisatokenid",
                { expiresIn: "1 day" }
            );
            res.status(200).json({ token: token, userId: loadedUser.user_id });
        }
    }
};

exports.loginWeb = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    const user = await User.findOne({
        where: {
            email: email, [Op.or]: [
                { user_type: "Manager" },
                { user_type: "Admin" },
            ],
        }
    }).catch(
        (err) => {
            //check network failures
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    );
    if (!user) {
        const error = new Error("Such user does not exist, please Sign Up !!!");
        error.statusCode = 400;
        next(error);
    } else {
        loadedUser = user;
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error("Wrong password!!!");
            error.statusCode = 400;
            next(error);
        } else {
            const token = jwt.sign(
                //genarate token and send back to user,token includes userid & fname
                { user_id: loadedUser.user_id, name: loadedUser.fname },
                "thisisatokenid",
                { expiresIn: "1 day" }
            );
            res.status(200).json({ token: token, userId: loadedUser.user_id });
        }
    }
};

//forgotPassowrd
exports.forgotPassword = function (req, res, next) {

    const email = req.params.email;
    // console.log(email);
    User.findOne({
        where: {
            email: email, [Op.or]: [
                { user_type: "Manager" },
                { user_type: "Admin" },
            ],
        }
    })
        .then((user) => {
            if (!user) {
                err = "User Not Found !!!";
                console.log("No User");
                // console.log(user.email);
                const error = new Error(err);
                error.statusCode = 404;
                next(error);

            } else if (user) {
                sendEmail(user.email, templates.resetPassword(user.user_id));
                console.log("Has User");
                console.log(user.email);
                // console.log(user.email);
                // console.log(user.user_id);
                // console.log(msgs.forgotPassword);
                return res.status(200).json(msgs.forgotPassword);
            } else {
                console.log("Else User");
                // console.log(user.email);
                err = "Cannot send email to this address";
                return res.status(404).json(err);
            }
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

//reset password
exports.resetPassword = (req, res, next) => {
    // var validPasswordRegex = RegExp(
    //     /^(?=.\d)(?=.[a-z])(?=.[A-Z])(?=.[^a-zA-Z0-9])(?!.*\s).{6,20}$/
    // );
    const email = req.params.email;
    const newpassword = req.body.password;
    // const confirmpassword = req.body.confirmpassword;
    // if (!validPasswordRegex.test(newpassword)) {
    //     passerr = "Password must between 6 to 20 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character";
    //     return res.status(400).json(passerr);
    // } else if (confirmpassword !== newpassword) {
    //     passerr = "Passwords must match!";
    //     return res.status(400).json(passerr);
    // } else {
    User.findOne({ where: { email } })
        .then(user => {
            // A user with that id does not exist in the DB. Perhaps some tricky
            // user tried to go to a different url than the one provided in the
            // confirmation email.
            if (!user) {
                res.json({ msg: msgs.couldNotFind });
            }
            // The user exists but has not been confirmed. We need to confirm this
            // user and let them know their email address has been confirmed.
            else if (user) {
                bcrypt.genSalt(8, function (err, salt) {
                    bcrypt.hash(newpassword, salt, (err, hash) => {
                        if (err) throw err;
                        User.password = hash;
                        User.update(
                            {
                                password: hash,
                            },
                            { where: { email } }
                        ).then((user) => {
                            if (!user) {
                                err = "User not found";
                                return res.status(404).json(err);
                            } else {
                                console.log(msgs.resetPassword)
                                res.json({
                                    success: true,
                                    msg: msgs.resetPassword,
                                });
                            }
                        }).catch(err => {
                            if (!err.statusCode) {
                                err.statusCode = 500;
                            }
                            next(err);
                        });
                    })
                });
                // let hashedpw = null;
                // await bcrypt.genSalt(8, function (err, salt) {
                //     console.log(salt);
                //     bcrypt.hash(password, salt, function (err, hash) {
                //         if (err) {
                //             next(err);
                //         }
                //         hashedpw = hash;
                //         console.log(hashedpw);
                //         // Store hash in your password DB.
                //     });
                // });
            }
            // The user has already confirmed this email address.
            else {
                res.json({ msg: msgs.errorPassword })
            }
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
    // }
}
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
        const allUsers = await User.findAll({ where: { user_id } });
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
    const { user_id, password, name, dob, user_type, telephone_no, nic, address } = req.body;
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