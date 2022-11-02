const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/userController');
const sessionCheck = require('../../config/adminSessionCheck');

router.get('/userList',sessionCheck.authCheckAfter,userController.userList);
router.post('/viewDetails',userController.viewDetails);
router.post('/blockUser',userController.blockUser);

module.exports = router;