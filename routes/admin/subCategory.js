const express = require('express');
const subCategoryController = require('../../controllers/admin/subCategoryController');
const sessionCheck = require('../../config/adminSessionCheck');
const router = express.Router();

router.get('/',sessionCheck.authCheckAfter,subCategoryController.subCategory);
router.post('/addSubCategory',sessionCheck.authCheckAfter,subCategoryController.addSubCategory);
router.post('/existSubCategory', subCategoryController.checkSubCategory);
router.get('/subCategoryList',sessionCheck.authCheckAfter,subCategoryController.findSubCategories);
router.delete('/deleteSubCategory',subCategoryController.deleteSubCategory);
router.post('/editSubCategory',subCategoryController.editSubCategory);
router.put('/updateSubCategory/:id',subCategoryController.updateCategory);
router.post('/searchSubCategory',subCategoryController.searchSubCategory);

module.exports = router;