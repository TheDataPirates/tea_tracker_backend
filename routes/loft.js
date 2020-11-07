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

module.exports = router;
