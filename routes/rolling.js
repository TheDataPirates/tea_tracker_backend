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
router.patch("/rbreaking", isAuth, rollingController.createRollBreaking);

//GET rolling/fermentings
router.get("/fermentings", isAuth, rollingController.getFermentings);

//PATCH rolling/fermenting
router.patch("/fermenting", isAuth, rollingController.createFermenting);

//GET rolling/dryings
router.get("/dryings", isAuth, rollingController.getDryings);

//POST rolling/drying
router.patch("/drying", isAuth, rollingController.createDrying);

module.exports = router;
