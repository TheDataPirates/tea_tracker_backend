const express = require("express");

const isAuth = require("../middleware/is-auth");
const rollingController = require("../controllers/rolling");
const router = express.Router();

//GET rolling/rbreakings
router.get("/rbreakings", isAuth, rollingController.getRollBreakings);

//POST rolling/rbreaking
router.post("/rbreaking", isAuth, rollingController.createRollBreaking);

module.exports = router;
