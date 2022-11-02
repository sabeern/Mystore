const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/user/wishlistController');
const userSessionCheck = require('../../config/userSessionCheck');

router.post('/addToWishlist',cartController.addToWishlist);
router.get('/wishlist',userSessionCheck.userExistCheck,cartController.loadWishlist);
router.post('/removeFromWhishlist',cartController.removeWhishlistItem);

module.exports = router;