const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/admin/categoryController');
const sessionCheck = require('../../config/adminSessionCheck');

router.get('/', sessionCheck.authCheckAfter, categoryController.category);
router.post('/addCategory', categoryController.addCategory)
router.post('/existCategory', categoryController.checkCategory);
router.get('/categoryList',sessionCheck.authCheckAfter, categoryController.findCategories);
router.delete('/deleteCategory',categoryController.deleteCategory);
router.post('/editCategory',categoryController.editCategory);
router.put('/updateCategory/:id',categoryController.updateCategory);
router.post('/searchCategory',categoryController.searchCategory);

module.exports = router;