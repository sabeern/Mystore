const express = require('express');
const router = express.Router();
const productController = require('../../controllers/admin/productController');
const sessionCheck = require('../../config/adminSessionCheck');

router.get('/', sessionCheck.authCheckAfter, productController.product);
router.post('/addProduct', productController.addProduct);
router.post('/loadSubcategory',productController.loadSubcategory);
router.get('/productList',sessionCheck.authCheckAfter,productController.productList);
router.delete('/deleteProduct',productController.deleteProduct);
router.post('/editProduct',productController.editProduct);
router.put('/updateProduct/:id',productController.updateProduct);
router.post('/searchProduct',productController.searchProduct);

module.exports = router;