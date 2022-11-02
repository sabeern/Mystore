const express = require('express');
const router = express.Router();
const brandController = require('../../controllers/admin/brandController');
const sessionCheck = require('../../config/adminSessionCheck');

router.get('/', sessionCheck.authCheckAfter, brandController.brand);
router.post('/addBrand', brandController.addBrand);

module.exports = router;