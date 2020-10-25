const express = require('express');

const broughtLeafController = require('../controllers/brought_leaf');
const router = express.Router();



//GET /bleaf/lots
router.get('/lots',broughtLeafController.getLots);

// POST /bleaf/lots
router.post('/lot',broughtLeafController.createLots);


module.exports = router;