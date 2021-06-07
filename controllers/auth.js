const {validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {Op} = require("sequelize");
const User = require("../models/user");
const templates = require("../email/email.templates");
const sendEmail = require("../email/email.send");
const msgs = require("../email/email.msgs");
const aleaRNGFactory = require("number-generator/lib/aleaRNGFactory");
const generator1 = aleaRNGFactory(4836325);
const random = require('random')


let passwordConfirm, nameConfirm, dobConfirm, emailConfirm, user_typeConfirm, telephone_noConfirm, nicConfirm,
    addressConfirm, imageConfirm = '';

exports.signup = async (req, res, next) => {
    const errors = validationResult(req); //this will get errors in validation middleware
    if (!errors.isEmpty()) {
        const error = new Error("User already exists !");
        error.statusCode = 422;
        error.data = errors.array();
        next(error);
    } else {
        const {user_id, password, name, dob, email, user_type, telephone_no, nic, address} = req.body;
        let hashedpw;
        await bcrypt.genSalt(8, function (err, salt) {
            console.log(salt);
            bcrypt.hash(password, salt, async function (err, hash) {
                if (err) {
                    next(err);
                }
                hashedpw = hash;
                console.log(hashedpw);
                try {
                    switch (user_type) {
                        case 'Agent':
                            await User.create({
                                user_id: `AG${random.int(10000, 99999)}`,
                                password: hashedpw,
                                name: name,
                                dob: dob,
                                email,
                                user_type: user_type,
                                telephone_no: telephone_no,
                                nic: nic,
                                address: address,
                                image: req.file.path //storing image path uploads/images/...
                            });

                            break;
                        case 'Officer':
                            await User.create({
                                user_id: `OF${random.int(10000, 99999)}`,
                                password: hashedpw,
                                name: name,
                                dob: dob,
                                email,
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
                // Store hash in your password DB.
            });
        });
    }
};

exports.signupManager = async (req, res, next) => {

    // const {user_id, password, name, dob, email,user_type, telephone_no, nic, address} = req.body;
    console.log(passwordConfirm);
    let hashedpw;
    await bcrypt.genSalt(8, function (err, salt) {
        console.log(salt);
        bcrypt.hash(passwordConfirm, salt, async function (err, hash) {
            if (err) {
                next(err);
            }
            hashedpw = hash;
            console.log(hashedpw);
            try {
                await User.create({
                    user_id: `MG${generator1.uInt32()}`,
                    password: hashedpw,
                    name: nameConfirm,
                    email: emailConfirm,
                    dob: dobConfirm,
                    user_type: "Manager",
                    telephone_no: telephone_noConfirm,
                    nic: nicConfirm,
                    address: addressConfirm,
                    image: imageConfirm //storing image path uploads/images/...
                });
                console.log("Manager saved");
                res.status(200).json({message: "Manager created"});
            } catch (err) {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            }
            // Store hash in your password DB.
        });
    });

};
exports.signupBeforeConfirm = async (req, res, next) => {
    const errors = validationResult(req); //this will get errors in validation middleware


    if (!errors.isEmpty()) {
        const error = new Error("Sign up failed !");
        error.statusCode = 422;
        error.data = errors.array();
        next(error);
    } else {
        const {user_id, password, name, dob, email, user_type, telephone_no, nic, address} = req.body;
        passwordConfirm = password;
        nameConfirm = name;
        dobConfirm = dob
        emailConfirm = email;
        user_typeConfirm = user_type;
        telephone_noConfirm = telephone_no;
        nicConfirm = nic;
        addressConfirm = address;
        imageConfirm = req.file.path;

        const user = await User.findOne({
            where: {
                email
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
        if (user) {
            const error = new Error("Email already exists !!!");
            error.statusCode = 400;
            next(error);
        }

        try {
            await sendEmail('damnera@gmail.com', templates.confirm(nameConfirm, emailConfirm, nicConfirm));

            console.log("Email is sent to admin");
            res.status(200).json({message: "Email is sent to admin"});
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
        // Store hash in your password DB.
    }


};

exports.login = async (req, res, next) => {
    const userid = req.body.user_id;
    const password = req.body.password;
    let loadedUser;
    const user = await User.findOne({
        where: {
            user_id: userid, [Op.or]: [
                {user_type: "Manager"},
                {user_type: "Admin"},
                {user_type: "Officer"},
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
                {user_id: loadedUser.user_id, name: loadedUser.fname},
                "thisisatokenid",
                {expiresIn: "1 day"}
            );
            res.status(200).json({token: token, userId: loadedUser.user_id});
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
                {user_type: "Manager"},
                {user_type: "Admin"},
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
                {user_id: loadedUser.user_id, name: loadedUser.fname},
                "thisisatokenid",
                {expiresIn: "1 day"}
            );
            res.status(200).json({token: token, userId: loadedUser.user_id, userType: loadedUser.user_type});
        }
    }
};

//forgotPassowrd
exports.forgotPassword = async function (req, res, next) {

    const email = req.params.email;
    const user = await User.findOne({
        where: {
            email: email, [Op.or]: [
                {user_type: "Manager"},
                {user_type: "Admin"},
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
        err = "User Not Found !!!";
        console.log("No User");
        // console.log(user.email);
        const error = new Error(err);
        error.statusCode = 404;
        next(error);

    } else if (user) {
        await sendEmail(user.email, templates.resetPassword(user.user_id));
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
}

//reset password
exports.resetPassword = async (req, res, next) => {

    const email = req.params.email;
    const newpassword = req.body.password;

    const user = await User.findOne({
        where: {
            email
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
        res.json({msg: msgs.couldNotFind});
    } else if (user) {
        await bcrypt.genSalt(8, function (err, salt) {
            console.log(salt);
            bcrypt.hash(newpassword, salt, async function (err, hash) {
                if (err) {
                    next(err);
                }
                try {
                    // User.password = hash;
                    await User.update(
                        {
                            password: hash,
                        },
                        {where: {email}});

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
                } catch (err) {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }
                    next(err);
                }
                // Store hash in your password DB.
            });
        });

    }

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

    let user = await User.destroy({where: {user_id}}).catch((err) => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
    if (!user) {
        console.log("user not found");
        res.status(500).json({message: "user not found"});
    } else {
        res.status(200).json({
            user: "Deleted",
        });
    }
};