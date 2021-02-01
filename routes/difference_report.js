const express = require("express");

const differenceReportController = require("../controllers/difference_report");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

//GET /diff/dreports
router.get("/dreports", isAuth, differenceReportController.getDreports);

// POST /diff/dreport
router.post("/dreport", isAuth, differenceReportController.createDreport);

// POST /diff/dreport
router.patch("/dreport", isAuth, differenceReportController.updateDreport);

module.exports = router;