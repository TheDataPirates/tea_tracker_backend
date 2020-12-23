const express = require("express");

const isAuth = require("../middleware/is-auth");
const rollingController = require("../controllers/rolling");
const router = express.Router();

//GET rolling/rbreakings
router.get("/rbreakings", isAuth, rollingController.getRollBreakings);

//POST rolling/rbreaking
router.post("/rbreaking", isAuth, rollingController.createRollBreaking);

//GET rolling/fermentings
router.get("/fermentings", isAuth, rollingController.getFermentings);

//POST rolling/fermenting
router.patch("/fermenting", isAuth, rollingController.createFermenting);

//POST rolling/dryings
router.get("/dryings", isAuth, rollingController.getDryings);

//POST rolling/drying
router.post("/drying", isAuth, rollingController.createDrying);


module.exports = router;
