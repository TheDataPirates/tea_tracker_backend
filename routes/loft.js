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

//GET loft/batches
router.get("/batches", isAuth, loftController.getBatches);

//POST loft/batch
router.post("/batch", isAuth, loftController.createBatch);

// Reporting
//GET loft/reports/loading
router.get("/reports/loading", loftController.getLoftLoadingForReporting);

//GET loft/reports/unloading
router.get("/reports/unloading", loftController.getLoftUnloadingForReporting);

//GET loft/reports/starting
router.get("/reports/starting", loftController.getLoftStartingForReporting);

//GET loft/reports/finishing
router.get("/reports/finishing", loftController.getLoftFinishingForReporting);

//GET loft/reports/mixing
router.get("/reports/mixing", loftController.getLoftMixingForReporting);

module.exports = router;
