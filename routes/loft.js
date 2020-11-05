const express = require("express");

const isAuth = require("../middleware/is-auth");
const loftController = require("../controllers/loft");
const router = express.Router();

//POST loft/starting
router.post("/starting", isAuth, loftController.createStarting);

module.exports = router;
