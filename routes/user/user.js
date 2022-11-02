const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user/userController');

router.post('/signup/existUser',userController.userExistCheck);
router.post('/signup',userController.insertUser);
router.post('/signup/otpVerify',userController.verifyOtp);
router.post('/login',userController.login);
router.get('/logout',userController.logout);

module.exports = router;