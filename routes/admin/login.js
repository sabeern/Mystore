const express = require('express');
const router = express.Router();
const authCheck = require('../../config/adminSessionCheck');
const loginController = require('../../controllers/admin/loginController');

router.get('/', authCheck.authCheckBefore, loginController.loginLoad);
router.post('/login', loginController.loginCheck);
router.get('/dashboard', authCheck.authCheckAfter, loginController.adminDashboard);
router.get('/logout', loginController.logout);
router.post('/dashboard/monthlySale',loginController.monthlySalesLoad);
router.get('/salesReport', authCheck.authCheckAfter,loginController.salesReport);
router.post('/salesReport/generateReport',loginController.generateSalesReport);
router.post('/order/searchOrder',loginController.searchOrder);
router.get('/addAdmin',loginController.addAdmin);

module.exports = router;