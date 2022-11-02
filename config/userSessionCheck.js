const userModel = require('../models/user/userModel');
const mongoose = require('mongoose');

const authCheckAfter = (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.userType == 'customer') {
            next();
        } else {
            res.redirect('/admin');
        }
    } else {
        res.redirect('/');
    }
}
const userExistCheck = async (req,res,next) => {
    if(req.session.user) {
        let userId = req.session.user.userId;
        userId = mongoose.Types.ObjectId(userId);
        const existingUser = await userModel.findById(userId);
        if(existingUser.userName != req.session.user.userFullname) {
            req.session.user.userFullname = existingUser.userName;
        }
        if(existingUser.userStatus == 'blocked') {
            res.redirect('/ap/logout');
            return;
            }
    }
        next();
}

module.exports = { authCheckAfter,userExistCheck };