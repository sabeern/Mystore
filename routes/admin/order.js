const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/admin/orderController');
const sessionCheck = require('../../config/adminSessionCheck');

router.get('/orderList',sessionCheck.authCheckAfter,orderController.orderList);
router.post('/updateStatus',orderController.updateOrderStatus);
router.post('/deleteOrder',orderController.deleteOrder);
router.get('/viewOrder/:id',sessionCheck.authCheckAfter,orderController.viewUserDetails);

module.exports = router;