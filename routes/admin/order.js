const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/admin/orderController');
const sessionCheck = require('../../config/adminSessionCheck');

router.get('/orderList',sessionCheck.authCheckAfter,orderController.orderList);
router.post('/updateStatus',sessionCheck.authCheckAfter,orderController.updateOrderStatus);
router.post('/deleteOrder',sessionCheck.authCheckAfter,orderController.deleteOrder);
router.post('/sortOrder',sessionCheck.authCheckAfter,orderController.sortOrder);
router.get('/viewOrder/:id',sessionCheck.authCheckAfter,orderController.viewUserDetails);

module.exports = router;