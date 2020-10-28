const express = require('express');

const broughtLeafController = require('../controllers/brought_leaf');
const router = express.Router();



//GET /bleaf/lots
router.get('/lots',broughtLeafController.getLots);

// POST /bleaf/lot
router.post('/lot', broughtLeafController.createLots);

// DELETE /bleaf/lot
router.delete('/lot/:lotid', broughtLeafController.deleteLot);

//POST /bleaf/bulk
router.post('/bulk', broughtLeafController.createBulks);

//GET /bleaf/supp
router.post('/supp', broughtLeafController.createBulks);

module.exports = router;