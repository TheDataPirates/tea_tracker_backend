const express = require("express");

const broughtLeafController = require("../controllers/brought_leaf");
const isAuth = require("../middleware/is-auth");
const router = express.Router();


//GET /bleaf/lots/remeasuring
router.get("/lots/remeasuring", broughtLeafController.getRemeasureLots);

//GET /bleaf/lots
router.get("/lots", isAuth, broughtLeafController.getAllLots);

//GET /bleaf/lots
router.get("/lots/:Bulkid", isAuth, broughtLeafController.getLots);

// POST /bleaf/lot
router.post("/lot", isAuth, broughtLeafController.createLots);

// DELETE /bleaf/lot
router.delete("/lot/:lotid", isAuth, broughtLeafController.deleteLot);

//POST /bleaf/bulk
router.post("/bulk", isAuth, broughtLeafController.createBulks);

//POST /bleaf/supp
router.post("/supp", isAuth, broughtLeafController.createBulks);

//POST /bleaf/sync
router.post('/sync',broughtLeafController.createLotFromLocalDb);

//GET /bleaf/lots/remeasuring

//For Dashboard

//GET /bleaf/dashboard/supplierlotsfirstweek
router.get("/dashboard/supplierlotsfirstweek", broughtLeafController.getSupplierLotsFirstWeek);

//GET /bleaf/dashboard/supplierlotssecondweek
router.get("/dashboard/supplierlotssecondweek", broughtLeafController.getSupplierLotsSecondWeek);

//GET /bleaf/dashboard/supplierlotsthirdweek
router.get("/dashboard/supplierlotsthirdweek", broughtLeafController.getSupplierLotsThirdWeek);

//GET /bleaf/dashboard/supplierlotsfourthweek
router.get("/dashboard/supplierlotsfourthweek", broughtLeafController.getSupplierLotsFourthWeek);

//GET /bleaf/dashboard/todayPurchasedTea
router.get("/dashboard/todayPurchasedTea", broughtLeafController.getTodayPurchasedTea);



module.exports = router;
