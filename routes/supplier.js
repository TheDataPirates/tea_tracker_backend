const express = require("express");

const isAuth = require("../middleware/is-auth");
const supplyingController = require("../controllers/supply");
const fileUpload = require('../middleware/file-upload');
const router = express.Router();


//GET supp/suppliers
router.get('/suppliers',supplyingController.getSuppliers);

//POST supp/supplier
router.post('/supplier',fileUpload.single('image'),isAuth,supplyingController.createSupplier);

//GET supp/suppliers/:suppId
router.get("/suppliers/:suppId",supplyingController.getSupplier);

//GET supp/reports/supplier/:suppId
router.get("/reports/supplier/:suppId/:time",supplyingController.getSupplierInfoForReporting);

//GET supp/suppliers/:supName
router.get("/supplier/:suppId/:supName",isAuth,supplyingController.getSupplierByName);

//PATCH supp/suppliers
router.patch("/suppliers",fileUpload.single('image'),isAuth,supplyingController.updateSupplier);

//DELETE supp/user/:suppId
router.delete("/supplier/:suppId",isAuth,supplyingController.deleteSupplier);

//Reporting
//GET supp/suppliers
router.get('/agentsupplies',supplyingController.getAgentSupplierInfoForReporting);

//Dashboard
//GET supp/dashboard/suppliersuntiltoday
router.get("/dashboard/suppliersuntiltoday", supplyingController.getSuppliersuntiltoday);


module.exports = router;