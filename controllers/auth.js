const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signup = async (req, res, next) => {
  const errors = validationResult(req); //this will get errors in validation middleware
  if (!errors.isEmpty()) {
    const error = new Error("validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
  } else {
    const userId = req.body.user_id;
    const password = req.body.password;
    const name = req.body.fname;
    const hashedpw = await bcrypt.hash(password, 8).catch((err) => {
      //hashing enterd pw and store it db, hashing cannot turn back previous values
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
    await User.create({
      user_id: userId,
      password: hashedpw,
      fname: name,
    });
    res.status(200).json({ message: "User created" });
  }
};

exports.login = async (req, res, next) => {
  const userid = req.body.user_id;
  const password = req.body.password;
  let loadedUser;
  const user = await User.findOne({ where: { user_id: userid } }).catch(
    (err) => {
      //check network faliurs
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
        { user_id: loadedUser.user_id, name: loadedUser.fname },
        "thisisatokenid",
        { expiresIn: "1h" }
      );
      res.status(200).json({ token: token, userId: loadedUser.user_id });
    }
  }
};
