const mongoose = require('mongoose');

const couponSchema = mongoose.Schema({
                couponCode:{
                    type:String,
                    required:true,
                    unique:true,
                },
                minPurchaseAmount:{
                    type:Number,
                    required:true
                },
                couponPercentage:{
                    type:Number,
                    required:true
                },
                maxDiscountAmount:{
                    type:Number,
                    required:true
                },
                expiryDate:{
                    type:Date,
                    required:true
                },
                delFlag:{
                    type:Number,
                    required:true,
                    default:0
                }
});

module.exports = mongoose.model(process.env.COUPON_COLLECTION,couponSchema);