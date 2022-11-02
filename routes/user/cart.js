const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/user/cartController');
const userSessionCheck = require('../../config/userSessionCheck');

router.post('/addToCart',cartController.addtoCart);
router.post('/lessFromCart',cartController.lessFromCart);
router.get('/cart',userSessionCheck.userExistCheck,cartController.loadCart);
router.post('/removeFromCart',cartController.removeCartItem);
router.post('/checkout',cartController.checkout);
router.post('/checkout/placeorder',cartController.placeorder);
router.get('/checkout/orderSuccess',cartController.orderSuccess);
router.post('/checkout/paymentSuccess',cartController.paymentSuccess);
router.get('/checkout/paymentSuccess',cartController.paymentSuccess);
router.get('/checkout/paymentFail',cartController.paymentFail);

module.exports = router;