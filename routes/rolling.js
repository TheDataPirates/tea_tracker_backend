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

//GET rolling/reports/rollings
router.get("/reports/rollings", rollingController.getRollingForReporting);

//GET rolling/reports/rollingss/:date
router.get("/reports/rollingss/:date", rollingController.getRollingForReportingWithDate);

//GET rolling/reports/rollings
router.get("/reports/rbreakings", rollingController.getRollBreakingForReporting);

//GET rolling/reports/rollingss/:date
router.get("/reports/rbreakingss/:date", rollingController.getRollBreakingForReportingWithDate);

//GET rolling/reports/rollings
router.get("/reports/fermentings", rollingController.getFermentingForReporting);

//GET rolling/reports/rollingss/:date
router.get("/reports/fermentingss/:date", rollingController.getFermentingForReportingWithDate);

//GET rolling/reports/dryings
router.get("/reports/dryings", rollingController.getDryingForReporting);

//GET rolling/reports/dryingss/:date
router.get("/reports/dryingss/:date", rollingController.getDryingForReportingWithDate);

//GET rolling/reports/outturn
router.get("/reports/outturn", rollingController.getOutturnForReporting);

//GET rolling/reports/outturns/:date
router.get("/reports/outturnss/:date", rollingController.getOutturnForReportingWithDate);

//Dashboard

//GET rolling/dashboard/dailydhoolpct
router.get("/dashboard/dailydhoolpct", rollingController.getDailyDhoolPct);

//GET rolling/dashboard/dailyfermenteddhoolpct
router.get("/dashboard/dailyfermenteddhoolpct", rollingController.getDailyFermentingDhoolPct);

//GET rolling/dashboard/rollerwisedhoolpct
router.get("/dashboard/rollerwisedhoolpct", rollingController.getRollerWiseDhoolPct);

//GET rolling/dashboard/todayTotalMadeTea
router.get("/dashboard/todayTotalMadeTea", rollingController.getTodayTotalMadeTea);

//GET rolling/dashboard/todayoutturn
router.get("/dashboard/todayoutturn", rollingController.getTodayoutturn);

//GET rolling/dashboard/totaloutturn
router.get("/dashboard/totaloutturn", rollingController.getTotalOutturn);

module.exports = router;

