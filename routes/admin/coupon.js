const express = require('express');
const router = express.Router();
const couponController = require('../../controllers/admin/couponController');
const sessionCheck = require('../../config/adminSessionCheck');

router.get('/',sessionCheck.authCheckAfter,couponController.couponForm);
router.post('/addCoupon',sessionCheck.authCheckAfter,couponController.addCoupon);
router.get('/couponList',sessionCheck.authCheckAfter,couponController.couponList);
router.delete('/deleteCoupon',sessionCheck.authCheckAfter,couponController.deleteCoupon);
router.post('/applyCoupon',sessionCheck.authCheckAfter,couponController.applyCoupon);

module.exports = router;