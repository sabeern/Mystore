const categoryModel = require('../../models/admin/categoryModel');
const subCategoryModel = require('../../models/admin/subCategoryModel');
const productModel = require('../../models/admin/productModel');
const cartModel = require('../../models/user/cartModel');
const wishlistModel = require('../../models/user/wishlistModel');

const aboutUs = async (req,res) => {
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
    res.render('./user/staticPages/aboutUs',{ allCategories, allSubCategories, userFullname,cartCount });
}
const secureShopping = async (req,res) => {
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
    res.render('./user/staticPages/secureShopping',{ allCategories, allSubCategories, userFullname,cartCount });
}
const termsNcondition = async (req,res) => {
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
    res.render('./user/staticPages/termsAndCondition',{ allCategories, allSubCategories, userFullname,cartCount });
}
const deliveryInformation = async (req,res) => {
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
    res.render('./user/staticPages/deliveryInformation',{ allCategories, allSubCategories, userFullname,cartCount });
}
const privacyPolicy = async (req,res) => {
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
    res.render('./user/staticPages/privacyPolicy',{ allCategories, allSubCategories, userFullname,cartCount });
}
const contactUs = async (req,res) => {
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
    res.render('./user/staticPages/contactUs',{ allCategories, allSubCategories, userFullname,cartCount });
}

module.exports = { aboutUs,secureShopping,termsNcondition,deliveryInformation,privacyPolicy,contactUs };