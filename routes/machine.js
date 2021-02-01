const express = require("express");

const isAuth = require("../middleware/is-auth");
const machineController = require("../controllers/machine");
const fileUpload = require('../middleware/file-upload');
const router = express.Router();

//GET machine/machines
router.get('/machines',machineController.getMachines);
//
//POST machine/machine
router.post('/machine',fileUpload.single('image'),isAuth,machineController.createMachine);
//
//GET /machine/machine
router.get("/machine",machineController.getMachine);
//
//PATCH machine/machines
router.patch("/machines/:type",isAuth,machineController.updateMachine);
//
//DELETE machine/machine
router.delete("/machine",isAuth,machineController.deleteMachine);
//
//
module.exports = router;