const mongoose = require('mongoose');
const cartModel = require('../../models/user/cartModel');
const categoryModel = require('../../models/admin/categoryModel');
const subCategoryModel = require('../../models/admin/subCategoryModel');
const productModel = require('../../models/admin/productModel');
const wishlistModel = require('../../models/user/wishlistModel');
const orderModel = require('../../models/user/orderModel');
const userModel = require('../../models/user/userModel');
const bcrypt = require('bcrypt');
const Razorpay = require('razorpay');
const instance = new Razorpay({
    key_id: 'rzp_test_WQBVHxOppgqaxl',
    key_secret: 'xtsqSRmSus2vixNarYwdAn37',
  });


const loadProfile = async (req,res) => {
    const allCategories = await categoryModel.find({ delFlag: 0 });
    const allSubCategories = await subCategoryModel.find({ delFlag: 0 });
    let userFullname,cartCount,profileDetails;
    if (req.session.user) {
        userFullname = req.session.user.userFullname;
        let userId = req.session.user.userId;
        cartCount = await cartModel.aggregate([{$match:{userId}},{$project:{count:{$size:"$cartItems"}}}]);
        if(cartCount.length < 1) {
            cartCount = false;
        }
        wishlistCount = await wishlistModel.aggregate([{$match:{userId}},{$project:{count:{$size:"$wishlistItems"}}}]);
        if(wishlistCount.length < 1) {
            wishlistCount = false;
        }
        profileDetails = await userModel.findOne({$and:[{_id:userId},{delFlag:0}]});
    } else {
        userFullname = false;
        cartCount = false;
        wishlistCount = false;
        profileDetails = false;
    }
    res.render('./user/profile/myprofile',{ allCategories, allSubCategories, userFullname,cartCount,wishlistCount,profileDetails });
}
const updateProfile = async (req,res) => {
    let { fullName,gender,email,mobile } = req.body;
    email = email.trim();
    fullName = fullName.trim();
    mobile = mobile.trim();
    if(!gender) {
        gender = '';
    }
    try {
        await userModel.findByIdAndUpdate(req.session.user.userId,{userName:fullName,userEmail:email,userMobile:mobile,gender});
    } catch (err) {
        console.log('email exist errorr');
    }
    res.redirect('/account/profile');
}
const address = async (req,res) => {
    const allCategories = await categoryModel.find({ delFlag: 0 });
    const allSubCategories = await subCategoryModel.find({ delFlag: 0 });
    let userFullname,cartCount,profileDetails;
    if (req.session.user) {
        userFullname = req.session.user.userFullname;
        let userId = req.session.user.userId;
        cartCount = await cartModel.aggregate([{$match:{userId}},{$project:{count:{$size:"$cartItems"}}}]);
        if(cartCount.length < 1) {
            cartCount = false;
        }
        wishlistCount = await wishlistModel.aggregate([{$match:{userId}},{$project:{count:{$size:"$wishlistItems"}}}]);
        if(wishlistCount.length < 1) {
            wishlistCount = false;
        }
        profileDetails = await userModel.findOne({$and:[{_id:userId},{delFlag:0}]});
    } else {
        userFullname = false;
        cartCount = false;
        wishlistCount = false;
        profileDetails = false;
    }
    res.render('./user/profile/manageAddress',{ allCategories, allSubCategories, userFullname,cartCount,wishlistCount,profileDetails });
}
const addAddress = async (req,res) => {
    const { fullName,mobile,pincode,locality,address,district,state } = req.body;
    try {
        await userModel.findByIdAndUpdate(req.session.user.userId,
            {$push:{userAddress:{fullName,mobileNumber:mobile,pincode,locality,address,district,state}}});
    }catch (err) {
        console.log('update error');
    }
        res.redirect('/account/address');
}
const removeAddress = async (req,res) => {
    let addressId = req.params.id;
    let userId = req.session.user.userId;
    try {
        addressId = mongoose.Types.ObjectId(addressId);
    }catch(err) {
        res.redirect('/account/address');
        return;
    }
    await userModel.updateOne({_id:userId},{$pull:{"userAddress":{"_id":addressId}}});
    res.redirect('/account/address');
}
const loadPassword = async (req,res) => {
    const allCategories = await categoryModel.find({ delFlag: 0 });
    const allSubCategories = await subCategoryModel.find({ delFlag: 0 });
    let userFullname,cartCount;
    if (req.session.user) {
        userFullname = req.session.user.userFullname;
        let userId = req.session.user.userId;
        cartCount = await cartModel.aggregate([{$match:{userId}},{$project:{count:{$size:"$cartItems"}}}]);
        if(cartCount.length < 1) {
            cartCount = false;
        }
        wishlistCount = await wishlistModel.aggregate([{$match:{userId}},{$project:{count:{$size:"$wishlistItems"}}}]);
        if(wishlistCount.length < 1) {
            wishlistCount = false;
        }
    } else {
        userFullname = false;
        cartCount = false;
        wishlistCount = false;
    }
    const errMsg = req.flash('errMsg');
    res.render('./user/profile/changePassword',{ allCategories, allSubCategories, userFullname,cartCount,wishlistCount,errMsg });
}
const changePassword = async (req,res) => {
    let { newPassword,oldPassword } = req.body;
    newPassword = newPassword.trim();
    oldPassword = oldPassword.trim();
    newPassword = await bcrypt.hash(newPassword,10);
    const existUser = await userModel.findById(req.session.user.userId);
    const compareStatus = await bcrypt.compare(oldPassword,existUser.userPassword);
    if(compareStatus) {
            await userModel.findByIdAndUpdate(req.session.user.userId,{userPassword:newPassword});
            res.redirect('/account/profile');
    }else {
        req.flash('errMsg','Old password not matching');
        res.redirect('/account/password');
    }
}
const myOrder = async (req,res) => {
    const allCategories = await categoryModel.find({ delFlag: 0 });
    const allSubCategories = await subCategoryModel.find({ delFlag: 0 });
    let userFullname,cartCount,userOrders;
    if (req.session.user) {
        userFullname = req.session.user.userFullname;
        let userId = req.session.user.userId;
        cartCount = await cartModel.aggregate([{$match:{userId}},{$project:{count:{$size:"$cartItems"}}}]);
        if(cartCount.length < 1) {
            cartCount = false;
        }
        wishlistCount = await wishlistModel.aggregate([{$match:{userId}},{$project:{count:{$size:"$wishlistItems"}}}]);
        if(wishlistCount.length < 1) {
            wishlistCount = false;
        }
        userOrders = await orderModel.find({$and:[{userId},{delFlag:0}]}).sort({orderDate:-1}).limit(12);
    } else {
        userFullname = false;
        cartCount = false;
        wishlistCount = false;
        userOrders = false;
    }
    res.render('./user/profile/myOrder',{ allCategories, allSubCategories, userFullname,cartCount,wishlistCount,userOrders });
}
const viewUserOrder = async (req,res) => {
    const allCategories = await categoryModel.find({ delFlag: 0 });
    const allSubCategories = await subCategoryModel.find({ delFlag: 0 });
    let userFullname,cartCount,orderList;
    if (req.session.user) {
        userFullname = req.session.user.userFullname;
        let userId = req.session.user.userId;
        cartCount = await cartModel.aggregate([{$match:{userId}},{$project:{count:{$size:"$cartItems"}}}]);
        if(cartCount.length < 1) {
            cartCount = false;
        }
        wishlistCount = await wishlistModel.aggregate([{$match:{userId}},{$project:{count:{$size:"$wishlistItems"}}}]);
        if(wishlistCount.length < 1) {
            wishlistCount = false;
        }
        let orderId = req.params.id;
        try {
            orderId = mongoose.Types.ObjectId(orderId);
        } catch (err) {
            res.redirect('/noresult');
            return;
        }
        orderList = await orderModel.aggregate([{$match:{_id:orderId,delFlag:0}},{$unwind:'$orderItems'},
                            {$project:{orderId:'$orderId',totalAmount:'$totalAmount',deliveryCharge:'$deliveryCharge',discount:'$discount',address:'$deliveryAddress',item:'$orderItems.productId',itemQuantity:'$orderItems.productQuantity',itemPrice:'$orderItems.productPrice'}},
                            {$lookup:{from:process.env.PRODUCT_COLLECTION,localField:'item',foreignField:'_id',as:'product'}}]);
            if(orderList.length < 1) {
                res.redirect('/');
                return;
            }
    } else {
        userFullname = false;
        cartCount = false;
        orderList = false;
    }
    
    res.render('./user/profile/orderDetails',{ allCategories, allSubCategories, userFullname,cartCount,orderList });
}
const updateOrder = async (req,res) => {
    const { orderId } = req.body;
    await orderModel.findByIdAndUpdate(orderId,{orderStatus:'canceled'});
    res.redirect('/account/myorder');
}
const payAgain = async (req,res) => {
    let { orderId } = req.body;
    orderId = mongoose.Types.ObjectId(orderId);
    let orderDetails = await orderModel.findById(orderId);
    const options = {
            amount: orderDetails.totalAmount*100,  // amount in the smallest currency unit
            currency: "INR",
            receipt:""+orderDetails._id
          };
        const user = await userModel.findById(req.session.user.userId);
        const fullName = user.userName;
        const mobileNumber = user.userMobile;
        const address = orderDetails.deliveryAddress[0].address;
        const userEmail = user.userEmail;
        const cartId = orderDetails.cartId;
        instance.orders.create(options, function(err, order) {
            const orderId = order.id;
            const userDetails = {fullName,mobileNumber,address,userEmail,cartId};
            res.send({options,userDetails,orderId});
            });  
}

module.exports = { loadProfile, updateProfile, address,addAddress,loadPassword,changePassword,myOrder,viewUserOrder,updateOrder,payAgain,removeAddress };