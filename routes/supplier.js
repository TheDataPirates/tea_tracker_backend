const express = require("express");

const isAuth = require("../middleware/is-auth");
const supplyingController = require("../controllers/supply");
const router = express.Router();


//GET supp/suppliers
router.get('/suppliers',supplyingController.getSuppliers);

//POST supp/supplier
router.post('/supplier',isAuth,supplyingController.createSupplier);


module.exports = router;