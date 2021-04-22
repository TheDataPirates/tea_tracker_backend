const express = require("express");

const isAuth = require("../middleware/is-auth");
const loftController = require("../controllers/loft");
const router = express.Router();

//GET loft/startings
router.get("/startings", isAuth, loftController.getStartings);

//POST loft/starting
router.post("/starting", isAuth, loftController.createStarting);

//GET loft/mixings
router.get("/mixings", isAuth, loftController.getMixings);

//POST loft/mixing
router.post("/mixing", isAuth, loftController.createMixing);

//GET loft/finishings
router.get("/finishings", isAuth, loftController.getFinishings);

//POST loft/finishing
router.post("/finishing", isAuth, loftController.createFinishing);

//GET loft/loadings
router.get("/loadings", isAuth, loftController.getLoadings);

//POST loft/loading
router.post("/loading", isAuth, loftController.createLoading);

//POST loft/unloading
router.post("/unloading", isAuth, loftController.createUnloading);

//GET loft/unloadings
router.get("/unloadings", isAuth, loftController.getUnloadings);

//GET loft/batches
router.get("/batches", isAuth, loftController.getBatches);

//POST loft/batch
router.post("/batch", isAuth, loftController.createBatch);

// Reporting
//GET loft/reports/loading
router.get("/reports/loading", loftController.getLoftLoadingForReporting);

//GET loft/reports/loadings/:date
router.get("/reports/loadings/:date", loftController.getLoftLoadingsForReportingWithDate);

//GET loft/reports/unloading
router.get("/reports/unloading", loftController.getLoftUnloadingForReporting);

//GET loft/reports/unloadings/:date
router.get("/reports/unloadings/:date", loftController.getLoftUnloadingForReportingWithDate);

//GET loft/reports/starting
router.get("/reports/starting", loftController.getLoftStartingForReporting);

//GET loft/reports/startings/:date
router.get("/reports/startings/:date", loftController.getLoftStartingForReportingWithDate);

//GET loft/reports/finishing
router.get("/reports/finishing", loftController.getLoftFinishingForReporting);

//GET loft/reports/finishings/:date
router.get("/reports/finishings/:date", loftController.getLoftFinishingForReportingWithDate);

//GET loft/reports/mixing
router.get("/reports/mixing", loftController.getLoftMixingForReporting);

//GET loft/reports/mixings/:date
router.get("/reports/mixings/:date", loftController.getLoftMixingForReportingWithDate);

module.exports = router;
