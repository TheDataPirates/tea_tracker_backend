const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authController = require("../controllers/auth");
const isAuth = require("../middleware/is-auth");
const fileUpload = require('../middleware/file-upload');
const User = require("../models/user");

//PUT auth/signup
router.put(
  //why use put? -- PUT method requests for the enclosed entity be stored under the supplied Request & refers to an already existing resource – an update operation will happen, otherwise create operation should happen
  "/signup",
  fileUpload.single('image'),
  [
    body("name")
      .trim()
      .notEmpty()
      .custom((value, { req }) => {
        //these are from express validator and this middleware check user id exist and throw error
        return User.findOne({ where: { name: value } }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("User's name already exists!");
          }
        });
      }),
    body("password").trim().notEmpty(),
  ],
  authController.signup
);

//PUT auth/signupbeforeconfirm
router.put(
    //why use put? -- PUT method requests for the enclosed entity be stored under the supplied Request & refers to an already existing resource – an update operation will happen, otherwise create operation should happen
    "/signupbeforeconfirm",
    fileUpload.single('image'),
    [
        body("email")
            .trim()
            .notEmpty()
            .custom((value, { req }) => {
                //these are from express validator and this middleware check user id exist and throw error
                return User.findOne({ where: { email: value } }).then((userDoc) => {
                    if (userDoc) {
                        return Promise.reject("Email already exists!");
                    }
                });
            }),
        body("password").trim().notEmpty(),
    ],
    authController.signupBeforeConfirm
);

//GET auth/signupmanager
router.get(
    //why use put? -- PUT method requests for the enclosed entity be stored under the supplied Request & refers to an already existing resource – an update operation will happen, otherwise create operation should happen
    "/signupmanager",
    // [
    //     body("email")
    //         .trim()
    //         .notEmpty()
    //         .custom((value, { req }) => {
    //             //these are from express validator and this middleware check user id exist and throw error
    //             return User.findOne({ where: { email: value } }).then((userDoc) => {
    //                 if (userDoc) {
    //                     return Promise.reject("Email already exists!");
    //                 }
    //             });
    //         }),
    //     body("password").trim().notEmpty(),
    // ],
    authController.signupManager
);

//POST auth/login
router.post("/login", authController.login);

//GET auth/forgetpassword
router.get("/forgetpassword/:email", authController.forgotPassword);
//POST auth/loginWeb
router.post("/loginWeb", authController.loginWeb);

//PATCH auth/resetPassword
router.patch("/resetPassword/:email", authController.resetPassword);

//GET auth/users
router.get("/users",authController.getUsers);

//GET auth/users/:userId
router.get("/users/:userId",authController.getUser);

//PATCH auth/users
router.patch("/users",isAuth,authController.updateUser);

//DELETE auth/users
router.delete("/users/:userId",isAuth,authController.deleteUser);

module.exports = router;
