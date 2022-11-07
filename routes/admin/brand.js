const express = require('express');
const router = express.Router();
const brandController = require('../../controllers/admin/brandController');
const sessionCheck = require('../../config/adminSessionCheck');

router.get('/', sessionCheck.authCheckAfter, brandController.brand);
router.post('/addBrand', sessionCheck.authCheckAfter, brandController.addBrand);
router.get('/brandList', sessionCheck.authCheckAfter, brandController.brandList);
router.post('/editBrand', sessionCheck.authCheckAfter, brandController.brandEdit);
router.post('/updateBrand', sessionCheck.authCheckAfter, brandController.updateBrand);
router.delete('/deleteBrand', sessionCheck.authCheckAfter, brandController.deleteBrand);

module.exports = router;