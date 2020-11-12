const express = require("express");

const broughtLeafController = require("../controllers/brought_leaf");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

//GET /bleaf/lots
router.get("/lots", isAuth, broughtLeafController.getLots);

// POST /bleaf/lot
router.post("/lot", isAuth, broughtLeafController.createLots);

// DELETE /bleaf/lot
router.delete("/lot/:lotid", isAuth, broughtLeafController.deleteLot);

//POST /bleaf/bulk
router.post("/bulk", isAuth, broughtLeafController.createBulks);

//GET /bleaf/supp
router.post("/supp", isAuth, broughtLeafController.createBulks);

//POST /bleaf/sync
router.post('/sync',broughtLeafController.createLotFromLocalDb);

module.exports = router;
