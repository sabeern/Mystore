const mongoose = require('mongoose');

const otpSchema = mongoose.Schema({
    userEmail:{
        type:String,
        required:true
    },
    userOtp:{
        type:String,
        required:true
    },
    expiryDate:{
        type:Date,
        required:true
    }
});

module.exports = mongoose.model(process.env.OTP_COLLECTION,otpSchema);