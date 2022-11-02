const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/user/profileController');
const authCheck = require('../../config/userSessionCheck');
const userSessionCheck = require('../../config/userSessionCheck');

router.get('/profile',userSessionCheck.userExistCheck,authCheck.authCheckAfter,profileController.loadProfile);
router.post('/profile/update',profileController.updateProfile);
router.get('/address',userSessionCheck.userExistCheck,authCheck.authCheckAfter,profileController.address);
router.post('/address/addAddress',profileController.addAddress);
router.get('/password',userSessionCheck.userExistCheck,authCheck.authCheckAfter,profileController.loadPassword);
router.post('/password/changePassword',profileController.changePassword);
router.get('/myorder',userSessionCheck.userExistCheck,authCheck.authCheckAfter,profileController.myOrder);
router.get('/myorder/orderDetails/:id',userSessionCheck.userExistCheck,authCheck.authCheckAfter,profileController.viewUserOrder);
router.post('/myorder/updateOrder',profileController.updateOrder);
router.post('/myorder/payagain',profileController.payAgain);
router.get('/address/remove/:id',userSessionCheck.userExistCheck,authCheck.authCheckAfter,profileController.removeAddress);

module.exports = router;