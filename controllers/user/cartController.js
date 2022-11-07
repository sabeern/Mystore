const mongoose = require('mongoose');
const cartModel = require('../../models/user/cartModel');
const categoryModel = require('../../models/admin/categoryModel');
const subCategoryModel = require('../../models/admin/subCategoryModel');
const productModel = require('../../models/admin/productModel');
const wishlistModel = require('../../models/user/wishlistModel');
const orderModel = require('../../models/user/orderModel');
const userModel = require('../../models/user/userModel');
const couponModel = require('../../models/admin/couponModel');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const instance = new Razorpay({
    key_id: 'rzp_test_WQBVHxOppgqaxl',
    key_secret: 'xtsqSRmSus2vixNarYwdAn37',
  });

const addtoCart = async (req,res) => {
    if(req.session.user) {
        const reqLength = (Object.keys(req.body)).length;
        let productId,productQuantity;
        if(reqLength == 1) {
            ({productId} = req.body);
            productQuantity = 1;
        }else {
            ({productId,productQuantity} = req.body);
        }
        productId = new mongoose.Types.ObjectId(productId);
        let userId = req.session.user.userId;
        let userExist = await cartModel.findOne({userId});
        if(userExist) {
            let productExist = await cartModel.findOne({$and:[{userId},{cartItems:{$elemMatch:{productId}}}]});
            if(productExist){
                await cartModel.findOneAndUpdate({$and:[{userId},{"cartItems.productId":productId}]},{$inc:{"cartItems.$.productQuantity":productQuantity}});
            }else {
                await cartModel.updateOne({userId},{$push:{cartItems:{productId,productQuantity:productQuantity}}});
            }
        }else {
            let cart = new cartModel({
                    userId,cartItems:[{productId,productQuantity:productQuantity}]
                });
            try {
                await cart.save();
            }catch (err) {
                const msg = 'cart adding failed';
                    res.send({msg});
            }             
        }
        let cartCount = await cartModel.aggregate([{$match:{userId}},{$project:{count:{$size:"$cartItems"}}}]);
        res.send({cartCount});
    }else {
        const msg = 'please login to continue';
        res.send({msg});
        return;
    }
}
const lessFromCart = async (req,res) => {
    if(req.session.user) {
        let {productId} = req.body;
        productId = new mongoose.Types.ObjectId(productId);
        let userId = req.session.user.userId;
        let userExist = await cartModel.findOne({userId});
        if(userExist) {
            let productExist = await cartModel.findOne({$and:[{userId},{cartItems:{$elemMatch:{productId}}}]});
            if(productExist){
                await cartModel.findOneAndUpdate({$and:[{userId},{"cartItems.productId":productId}]},{$inc:{"cartItems.$.productQuantity":-1}});
            }else {
                await cartModel.updateOne({userId},{$push:{cartItems:{productId,productQuantity:1}}});
            }
        }else {
            const msg = 'Item failed to find';
            res.send({msg});
            return;          
        }
        let cartCount = await cartModel.aggregate([{$match:{userId}},{$project:{count:{$size:"$cartItems"}}}]);
        res.send({cartCount});
    }else {
        const msg = 'please login to continue';
        res.send({msg});
        return;
    }     
}
const loadCart = async (req,res) => {
    const allCategories = await categoryModel.find({ delFlag: 0 });
    const allSubCategories = await subCategoryModel.find({ delFlag: 0 });
    let userFullname,cartCount,cartList;
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
        cartList = await cartModel.aggregate([{$match:{userId}},{$unwind:'$cartItems'},
                        {$project:{item:'$cartItems.productId',itemQuantity:'$cartItems.productQuantity'}},
                        {$lookup:{from:process.env.PRODUCT_COLLECTION,localField:'item',foreignField:'_id',as:'product'}}]);
    } else {
        userFullname = false;
        cartCount = false;
        cartList = false;
    }
    res.render('./user/order/cart',{ allCategories, allSubCategories, userFullname,cartCount,cartList });
}
const removeCartItem = async (req,res) => {
    const {productId} = req.body;
    userId = req.session.user.userId;
    await cartModel.updateOne({userId},{$pull:{"cartItems":{"productId":productId}}});
    res.send({msg:'deleted'});
}
const checkout = async (req,res) => {
    let {cartId} = req.body;
    cartId = mongoose.Types.ObjectId(cartId);
    const allSubCategories = await subCategoryModel.find({ delFlag: 0 });
    const orderList = await cartModel.aggregate([{$match:{_id:cartId}},{$unwind:'$cartItems'},
                        {$project:{item:'$cartItems.productId',itemQuantity:'$cartItems.productQuantity'}},
                        {$lookup:{from:process.env.PRODUCT_COLLECTION,localField:'item',foreignField:'_id',as:'product'}}]);
        let userId = req.session.user.userId;    
        const profileDetails = await userModel.findOne({$and:[{_id:userId},{delFlag:0}]});
        const cartTotal = await cartModel.aggregate([{$match:{_id:cartId}},{$unwind:'$cartItems'},
                        {$project:{_id:0,item:'$cartItems.productId',itemQuantity:'$cartItems.productQuantity'}},
                        {$lookup:{from:process.env.PRODUCT_COLLECTION,localField:'item',foreignField:'_id',as:'product'}},
                        {$unwind:'$product'},{$group:{_id:null,total:{$sum: { $multiply: [ "$itemQuantity", "$product.productPrice" ] }}}}]);
        let totalAmount = 0 ,couponCode='';
        if(cartTotal.length > 0) {
            totalAmount = cartTotal[0].total;
        }
        const couponAvailable = await couponModel.find({$and:[{delFlag:0,minPurchaseAmount:{$lte:totalAmount},expiryDate:{$gte:new Date()}}]}).sort({minPurchaseAmount:-1}).limit(1);
        if(couponAvailable.length > 0) {
            couponCode = couponAvailable[0].couponCode;
        }
    res.render('./user/order/checkout',{orderList,profileDetails,allSubCategories,couponCode});
}
const placeorder = async (req,res) => {
    let fullName,mobileNumber,pincode,locality,address,district,state,orderNote,paymentMethod,cartId,deliveryDate,totalAmount,deliveryCharge,couponDiscount;
    if(req.body.selectedAddress == 'new') {
        ({fullName,mobileNumber,pincode,locality,address,district,state,orderNote,paymentMethod,cartId,deliveryDate,totalAmount,deliveryCharge,couponDiscount}  = req.body);
    }else {
        ({orderNote,paymentMethod,cartId,deliveryDate,totalAmount,deliveryCharge,couponDiscount}  = req.body);
        let addressId = req.body.selectedAddress;
        addressId = mongoose.Types.ObjectId(addressId);
        const addressSelected = await userModel.aggregate([{$match:{_id:req.session.user.userId}},{$unwind:'$userAddress'},{$match:{'userAddress._id':addressId}}]);
        fullName = addressSelected[0].userAddress.fullName;
        mobileNumber = addressSelected[0].userAddress.mobileNumber;
        pincode = addressSelected[0].userAddress.pincode;
        locality = addressSelected[0].userAddress.locality;
        address = addressSelected[0].userAddress.address;
        district = addressSelected[0].userAddress.district;
        state = addressSelected[0].userAddress.state;
    }
    objectCartId = mongoose.Types.ObjectId(cartId);
    const cartItems = await cartModel.aggregate([{$match:{_id:objectCartId}},{$unwind:'$cartItems'},
                {$project:{item:'$cartItems.productId',itemQuantity:'$cartItems.productQuantity'}},
                {$lookup:{from:process.env.PRODUCT_COLLECTION,localField:'item',foreignField:'_id',as:'product'}}]);
    let orderItems = [],eachItem,orderStatus;
    if(cartItems) {
        cartItems.forEach((items)=> {
            eachItem ={productId:items.item,productQuantity:items.itemQuantity,productPrice:items.product[0].productPrice};
            orderItems.push(eachItem);
        });
    }
    userId = req.session.user.userId;
    if(paymentMethod == 'COD') {
        orderStatus = 'approved';
    }else {
        orderStatus = 'pending';
    }
    if(deliveryDate == 'today') {
        deliveryDate = Date.now();
    }else {
        deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 1);
    }
    let orderId = Math.floor(Math.random()*90000) + 10000;
    const newOrder = new orderModel({
        userId,deliveryAddress:[{fullName,mobileNumber,pincode,locality,address,district,state}],
        orderItems,deliveryDate,paymentType:paymentMethod,orderStatus,orderNote,totalAmount,orderId,cartId,deliveryCharge,discount:couponDiscount
    });
    await orderModel.deleteOne({cartId});
    const insertedData = await newOrder.save();
    let insertId = insertedData._id;
    req.flash('orderId');
    req.flash('orderId',insertId);
    if(paymentMethod == 'COD') {
        await cartModel.findByIdAndDelete(objectCartId);
        res.send({msg:'COD'});
    }else {
        const options = {
            amount: totalAmount*100, 
            currency: "INR",
            receipt:""+insertId
          };
    const user = await userModel.findById(req.session.user.userId,{userEmail:1});
    const userEmail = user.userEmail;
        instance.orders.create(options, function(err, order) {
            const orderId = order.id;
            const userDetails = {fullName,mobileNumber,address,userEmail,cartId};
            res.send({options,userDetails,orderId});
            });   
    }
}
const paymentSuccess = async (req,res) => {
    const { response,payDetails,cartId,orderId } = req.body;
    let hmac = crypto.createHmac('sha256', 'xtsqSRmSus2vixNarYwdAn37');
    hmac = hmac.update(response.razorpay_order_id + "|" + response.razorpay_payment_id);
    hmac = hmac.digest('hex');
    await cartModel.findByIdAndDelete(cartId);
    if(hmac == response.razorpay_signature) {
        const successOrderId = mongoose.Types.ObjectId(payDetails.receipt);
        await orderModel.findByIdAndUpdate(successOrderId,{orderStatus:'approved',paymentId:orderId});
        req.flash('orderId',successOrderId);
        res.send({paymentStatus:'success'});
    }else {
        res.send({paymentStatus:'fail'});
    }
}
const orderSuccess = async (req,res) => {
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
        let orderId = req.flash('orderId')[0];
        if(!orderId) {
            res.redirect('/');
            return;
        }
        orderList = await orderModel.aggregate([{$match:{_id:orderId}},{$unwind:'$orderItems'},
                        {$project:{orderId:'$orderId',totalAmount:'$totalAmount',deliveryCharge:'$deliveryCharge',discount:'$discount',address:'$deliveryAddress',item:'$orderItems.productId',itemQuantity:'$orderItems.productQuantity',itemPrice:'$orderItems.productPrice'}},
                        {$lookup:{from:process.env.PRODUCT_COLLECTION,localField:'item',foreignField:'_id',as:'product'}}]);
    } else {
        userFullname = false;
        cartCount = false;
        orderList = false;
    }
    res.render('./user/order/orderSuccess',{ allCategories, allSubCategories, userFullname,cartCount,orderList });
}
const paymentFail = async (req,res) => {
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
    res.render('./user/order/paymentFail',{ allCategories, allSubCategories, userFullname,cartCount });
}

module.exports = { addtoCart, loadCart,lessFromCart,removeCartItem,checkout,placeorder,orderSuccess,paymentSuccess,paymentFail };