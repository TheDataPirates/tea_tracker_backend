const express = require("express");

const isAuth = require("../middleware/is-auth");
const supplyingController = require("../controllers/supply");
const router = express.Router();


//GET supp/suppliers
router.get('/suppliers',supplyingController.getSuppliers);

//POST supp/supplier
router.post('/supplier',isAuth,supplyingController.createSupplier);

//GET supp/suppliers/:suppId
router.get("/suppliers/:suppId",supplyingController.getSupplier);

//PATCH supp/suppliers
router.patch("/suppliers",isAuth,supplyingController.updateSupplier);

//DELETE supp/user/:suppId
router.delete("/supplier/:suppId",isAuth,supplyingController.deleteSupplier);


module.exports = router;