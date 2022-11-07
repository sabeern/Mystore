const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/userController');
const sessionCheck = require('../../config/adminSessionCheck');

router.get('/userList',sessionCheck.authCheckAfter,userController.userList);
router.post('/viewDetails',sessionCheck.authCheckAfter,userController.viewDetails);
router.post('/blockUser',sessionCheck.authCheckAfter,userController.blockUser);
router.post('/searchUser',sessionCheck.authCheckAfter,userController.searchUser);

module.exports = router;