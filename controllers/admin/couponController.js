const couponModel = require('../../models/admin/couponModel');

const couponForm = (req,res) => {
    res.render('./admin/coupon/couponForm',{errMsg:req.flash('errMsg')});
}
const addCoupon = async (req,res) => {
    let { couponCode,minPurchaseAmount,couponPercentage,maxLimit,expiryDate } = req.body;
    couponCode = couponCode.trim();
    minPurchaseAmount = minPurchaseAmount.trim();
    couponPercentage = couponPercentage.trim();
    maxLimit = maxLimit.trim();
    expiryDate = expiryDate.trim();
    expiryDate = new Date(expiryDate);
    const coupon = new couponModel({ couponCode,minPurchaseAmount,couponPercentage,maxDiscountAmount:maxLimit,expiryDate });
    try {
        await coupon.save();
    }catch(err) {
        req.flash('errMsg','Coupon code already exist');
        res.redirect('/admin/coupon');
        return;
    }
    res.redirect('/admin/coupon');
}
const couponList = async (req,res) => {
    const coupons = await couponModel.find({delFlag:0}).sort({expiryDate:-1});
    res.render('./admin/coupon/couponList',{coupons});
}
const deleteCoupon = async (req,res) => {
    const { couponId } = req.body;
    await couponModel.findByIdAndUpdate(couponId,{delFlag:1});
    res.send({msg:'deleted'});
}
const applyCoupon = async (req,res) => {
    const { couponCode,totalAmount } = req.body;
    const couponDetails = await couponModel.findOne({couponCode});
    let discount;
    if(couponDetails) {
        if(couponDetails.minPurchaseAmount <= totalAmount & couponDetails.expiryDate >= new Date()) {
            discount = (totalAmount*couponDetails.couponPercentage)/100;
            if(discount > couponDetails.maxDiscountAmount) {
                discount = couponDetails.maxDiscountAmount.toFixed(0);
            }
        }else {
            res.send({errMsg:'Coupon not valied'});
            return;
        }
    }else {
        res.send({errMsg:'Coupon not valied'});
        return;
    }
    discount = Math.round(discount,0);
    res.send({discount});
}

module.exports = { couponForm,addCoupon,couponList,deleteCoupon,applyCoupon };