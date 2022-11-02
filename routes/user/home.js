const express = require('express');
const router = express.Router();
const homeController = require('../../controllers/user/homeController');
const userSessionCheck = require('../../config/userSessionCheck');

router.get('/',userSessionCheck.userExistCheck,homeController.home);
router.post('/loadSubcategory',homeController.loadSubcategory);
router.post('/loadCategory',homeController.loadCategory);
router.get('/category/:id',homeController.loadCategoryItems);
router.get('/product/:id',homeController.loadEachItem);
router.post('/search',homeController.commonSearch);
router.get('/noresult',homeController.page404);
router.post('/category/pagination',homeController.pagination);
router.post('/category/sortData',homeController.sortData);

module.exports = router;