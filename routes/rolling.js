const express = require("express");
const isAuth = require("../middleware/is-auth");
const rollingController = require("../controllers/rolling");
const router = express.Router();

//GET rolling/rollings
router.get("/rollings", isAuth, rollingController.getRollings);

//POST rolling/rolling
router.post("/rolling", isAuth, rollingController.createRolling);

//GET rolling/rbreakings
router.get("/rbreakings", isAuth, rollingController.getRollBreakings);

//POST rolling/rbreaking
router.post("/rbreaking", isAuth, rollingController.createRollBreaking);

//GET rolling/fermentings
router.get("/fermentings", isAuth, rollingController.getFermentings);

//POST rolling/fermenting
router.post("/fermenting", isAuth, rollingController.createFermenting);

module.exports = router;
