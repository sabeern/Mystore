const express = require('express');
const router = express.Router();
const packingController = require('../../controllers/admin/packingController');
const sessionCheck = require('../../config/adminSessionCheck');

router.get('/', sessionCheck.authCheckAfter, packingController.packing);
router.post('/addPacking', packingController.addPacking);

module.exports = router;