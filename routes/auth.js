const express = require("express");
const router = express.Router();
const { body } = require("express-validator/check");
const authController = require("../controllers/auth");
const User = require("../models/user");

//PUT auth/signup
router.put(
  //why use put? -- PUT method requests for the enclosed entity be stored under the supplied Request & refers to an already existing resource – an update operation will happen, otherwise create operation should happen
  "/signup",
  [
    body("user_id")
      .trim()
      .notEmpty()
      .custom((value, { req }) => {
        //these are from express validator and this middleware check user id exist and throw error
        return User.findOne({ where: { user_id: value } }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("User Id already exists!");
          }
        });
      }),
    body("password").trim().notEmpty(),
  ],
  authController.signup
);

//POST auth/login
router.post("/login", authController.login);

module.exports = router;
