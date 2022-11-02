const mongoose = require('mongoose');
const cartModel = require('../../models/user/cartModel');
const categoryModel = require('../../models/admin/categoryModel');
const subCategoryModel = require('../../models/admin/subCategoryModel');
const productModel = require('../../models/admin/productModel');
const wishlistModel = require('../../models/user/wishlistModel');

const addToWishlist = async (req,res) => {
    if(req.session.user) {
        let {productId} = req.body;
        productId = new mongoose.Types.ObjectId(productId);
        let userId = req.session.user.userId;
        let userExist = await wishlistModel.findOne({userId});
        if(userExist) {
            let productExist = await wishlistModel.findOne({$and:[{userId},{wishlistItems:{$elemMatch:{productId}}}]});
            if(productExist){
                const msg = 'Product already in wishlist';
                    res.send({msg});
                    return;
            }else {
                await wishlistModel.updateOne({userId},{$push:{wishlistItems:{productId}}});
            }
        }else {
            let wishlist = new wishlistModel({
                    userId,wishlistItems:[{productId}]
                });
            try {
                await wishlist.save();
            }catch (err) {
                const msg = 'wishlist adding failed';
                    res.send({msg});
            }             
        }
        let cartCount = await wishlistModel.aggregate([{$match:{userId}},{$project:{count:{$size:"$wishlistItems"}}}]);
        res.send({cartCount});
    }else {
        const msg = 'please login to continue';
        res.send({msg});
        return;
    }
}
const loadWishlist = async (req,res) => {
    const allCategories = await categoryModel.find({ delFlag: 0 });
    const allSubCategories = await subCategoryModel.find({ delFlag: 0 });
    let userFullname,cartCount,wishlistCount,wishlistItems;
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
        wishlistItems = await wishlistModel.aggregate([{$match:{userId}},{$unwind:'$wishlistItems'},
                        {$project:{item:'$wishlistItems.productId'}},
                        {$lookup:{from:'products',localField:'item',foreignField:'_id',as:'product'}}]);
    } else {
        userFullname = false;
        cartCount = false;
        wishlistCount = false;
        wishlistItems = false;
    }
    res.render('./user/order/wishlist',{ allCategories, allSubCategories, userFullname,cartCount,wishlistCount,wishlistItems });
}
const removeWhishlistItem = async (req,res) => {
    const {productId} = req.body;
    userId = req.session.user.userId;
    await wishlistModel.updateOne({userId},{$pull:{"wishlistItems":{"productId":productId}}});
    res.send({msg:'deleted'});
}

module.exports = { addToWishlist,loadWishlist,removeWhishlistItem };