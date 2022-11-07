const categoryModel = require('../../models/admin/categoryModel');
const subCategoryModel = require('../../models/admin/subCategoryModel');
const productModel = require('../../models/admin/productModel');
const cartModel = require('../../models/user/cartModel');
const wishlistModel = require('../../models/user/wishlistModel');
const bannerModel = require('../../models/admin/bannerModel');
const mongoose = require('mongoose');

const home = async (req, res) => {
    const allCategories = await categoryModel.find({ delFlag: 0 });
    const allSubCategories = await subCategoryModel.find({ delFlag: 0 });
    const moreStockProduct = await productModel.aggregate([{$match:{delFlag:0}},{$sort:{productStock:-1}},{$limit:8}]);
    const latestProduct = await productModel.aggregate([{$match:{delFlag:0}},{$sort:{addedDate:-1}},{$limit:6}]);
    //const fruitVeg = await productModel.aggregate([{$match:{delFlag:0}},{$sort:{addedDate:-1}},{$limit:6}]);
    const fruitVeg = await productModel.aggregate([{$match:{delFlag:0,productCategoryId:mongoose.Types.ObjectId('63688eb63c1b22bf125563ed')}},{$sort:{addedDate:-1}},{$limit:6}]);
    //const meatFish = await productModel.aggregate([{$match:{delFlag:0}},{$sort:{addedDate:-1}},{$limit:6}]);
    const meatFish = await productModel.aggregate([{$match:{delFlag:0,productCategoryId:mongoose.Types.ObjectId('6368b13a97ac194c9df9392c')}},{$sort:{addedDate:-1}},{$limit:6}]);
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
    const bannerDetails = await bannerModel.find({}).sort({uploadDate:-1}).limit(3);
    res.render('./user/home', { allCategories, allSubCategories, userFullname,moreStockProduct,latestProduct,cartCount,title:'MyStore | Online Grocery',bannerDetails,fruitVeg,meatFish });
}
const loadSubcategory = async (req,res) => {
    let {categoryId} = req.body;
    categoryId = mongoose.Types.ObjectId(categoryId);
    const subCategory = await subCategoryModel.aggregate([{$match:{$and:[{categoryId},{delFlag:0}]}},{$lookup:{from:process.env.CATEGORY_COLLECTION,localField:'categoryId',foreignField:'_id',as:'selectCategory'}}]);
    res.send({subCategory});
}
const loadCategory = async (req,res) => {
    const category = await categoryModel.find({ delFlag: 0 });
    res.send({category});
}
const loadCategoryItems = async (req,res) => {
    let productSubCategoryId = req.params.id;
    try {
        productSubCategoryId = mongoose.Types.ObjectId(productSubCategoryId);
    }catch(err) {
        res.redirect('/noresult');
        return;
    }
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
    const categoryProducts = await productModel.aggregate([{$match:{productSubCategoryId,delFlag:0}},{$limit:18}]);
    const resultCount = await productModel.countDocuments({$and:[{productSubCategoryId},{delFlag:0}]});
    const minMaxAmount = await productModel.aggregate([{$match:{productSubCategoryId,delFlag:0}},{$group:{_id:null,"minValue":{$min:"$productPrice"},"maxValue":{$max:"$productPrice"}}}]);
    const brands = await productModel.aggregate([{$match:{productSubCategoryId,delFlag:0}},{$group:{_id:"$productBrandId"}},
                    {$lookup:{from:process.env.BRAND_COLLECTION,localField:'_id',foreignField:'_id',as:'brand'}}]);
    const subcategoryName = await subCategoryModel.findById(productSubCategoryId);
    let matchingSubcategories = [];
    if(categoryProducts.length > 0){
        matchingSubcategories = await subCategoryModel.find({$and:[{categoryId:categoryProducts[0].productCategoryId},{delFlag:0}]});
    }
    res.render('./user/categoryProducts',{ allCategories, allSubCategories, userFullname,cartCount,categoryProducts,matchingSubcategories,resultCount,minMaxAmount,brands,subcategoryName });
}
const sortData = async (req,res) => {
    let { sortType,productSubCategoryId,minAmount,maxAmount,brands,pageName,searchContent } = req.body;
    let brandObject = [];
    for(let i=0;i<brands.length;i++) {
        let newObject = brands[i];
        newObject = mongoose.Types.ObjectId(newObject);
        brandObject.push(newObject);
    }
    minAmount = parseInt(minAmount);
    maxAmount = parseInt(maxAmount);
    productSubCategoryId = mongoose.Types.ObjectId(productSubCategoryId);
    if(sortType == 'nameA') {
        sortType = {productName:1};
    }else if(sortType == 'nameZ'){
        sortType = {productName:-1};
    }else if(sortType == 'priceA') {
        sortType = {productPrice:1};
    }else if(sortType == 'priceZ') {
        sortType = {productPrice:-1};
    }else {
        sortType = {productName:1};
    }
    let sortResult,resultCount;
    if(pageName == 'categoryPage') {
            sortResult = await productModel.aggregate([{$match:{productSubCategoryId,delFlag:0,productPrice:{$gte:minAmount,$lte:maxAmount},productBrandId:{$in:brandObject}}},
                        {$sort:sortType},{$limit:18}]);
            resultCount = await productModel.aggregate([{$match:{productSubCategoryId,delFlag:0,productPrice:{$gte:minAmount,$lte:maxAmount},productBrandId:{$in:brandObject}}},
                {$sort:sortType},{$count:"productQuantity"}]);
    }
    if(pageName == 'searchPage'){
            sortResult = await productModel.aggregate([{$match:{productName:{$regex:new RegExp('.*'+searchContent+'.*','i')},delFlag:0,productPrice:{$gte:minAmount,$lte:maxAmount},productBrandId:{$in:brandObject}}},
                        {$sort:sortType},{$limit:18}]);
            resultCount = await productModel.aggregate([{$match:{productName:{$regex:new RegExp('.*'+searchContent+'.*','i')},delFlag:0,productPrice:{$gte:minAmount,$lte:maxAmount},productBrandId:{$in:brandObject}}},
                {$sort:sortType},{$count:"productQuantity"}]);
    }
    res.send({sortResult,resultCount,pageName});
}
const pagination = async (req,res) => {
    let { pageNumber,subCategoryId,sortType,minAmount,maxAmount,brands,pageName,searchContent } = req.body;
    if(sortType == 'nameA') {
        sortType = {productName:1};
    }else if(sortType == 'nameZ'){
        sortType = {productName:-1};
    }else if(sortType == 'priceA') {
        sortType = {productPrice:1};
    }else if(sortType == 'priceZ') {
        sortType = {productPrice:-1};
    }else {
        sortType = {productName:1};
    }
    let brandObject = [];
    for(let i=0;i<brands.length;i++) {
        let newObject = brands[i];
        newObject = mongoose.Types.ObjectId(newObject);
        brandObject.push(newObject);
    }
    minAmount = parseInt(minAmount);
    maxAmount = parseInt(maxAmount);
    try{
        subCategoryId = mongoose.Types.ObjectId(subCategoryId);
    } catch(err) {
        res.send({msg:'not match'});
    }
    let categoryProducts;
    if(pageName == 'categoryPage') {
            categoryProducts = await productModel.aggregate([{$match:{productSubCategoryId:subCategoryId,delFlag:0,productPrice:{$gte:minAmount,$lte:maxAmount},productBrandId:{$in:brandObject}}},
            {$sort:sortType},{$skip:((pageNumber-1)*18)},{$limit:18}]);
        }
    if(pageName == 'searchPage') {
                categoryProducts = await productModel.aggregate([{$match:{productName:{$regex:new RegExp('.*'+searchContent+'.*','i')},delFlag:0,productPrice:{$gte:minAmount,$lte:maxAmount},productBrandId:{$in:brandObject}}},
                {$sort:sortType},{$skip:((pageNumber-1)*18)},{$limit:18}]);
        }
    res.send({categoryProducts});
}
const loadEachItem = async (req,res) => {
    let productId = req.params.id;
    try {
        productId = mongoose.Types.ObjectId(productId);
    }catch(err) {
        res.redirect('/noresult');
        return;
    }
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
    const product = await productModel.findOne({$and:[{_id:productId},{delFlag:0}]});
    if(!product){
        res.redirect('/');
        return;
    }
    const relatedProducts = await productModel.find({$and:[{productSubCategoryId:product.productSubCategoryId},{delFlag:0},{_id:{$ne:product._id}}]}).limit(5);
    res.render('./user/eachProduct',{ allCategories, allSubCategories, userFullname,cartCount,product,relatedProducts });
}
const commonSearch = async(req,res) => {
    const { searchContent } = req.body;
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
    const searchProducts = await productModel.aggregate([{$match:{productName:{$regex:new RegExp('.*'+searchContent+'.*','i')},delFlag:0}},{$limit:18}]);
    if(searchProducts.length < 1) {
        res.redirect('/noresult');
        return;
    }
    const minMaxAmount = await productModel.aggregate([{$match:{productName:{$regex:new RegExp('.*'+searchContent+'.*','i')},delFlag:0}},{$group:{_id:null,"minValue":{$min:"$productPrice"},"maxValue":{$max:"$productPrice"}}}]);
    const brands = await productModel.aggregate([{$match:{productName:{$regex:new RegExp('.*'+searchContent+'.*','i')},delFlag:0}},{$group:{_id:"$productBrandId"}},
                    {$lookup:{from:process.env.BRAND_COLLECTION,localField:'_id',foreignField:'_id',as:'brand'}}]);
    const resultCount = await productModel.countDocuments({$and:[{productName:{$regex:new RegExp('.*'+searchContent+'.*','i')}},{delFlag:0}]});
    res.render('./user/commonSearch',{ allCategories, allSubCategories, userFullname,cartCount,searchProducts,minMaxAmount,brands,resultCount,searchContent });
}
const page404 = async (req,res) => {
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
    res.render('./user/page404',{ allCategories, allSubCategories, userFullname,cartCount });
}

module.exports = { home,loadSubcategory,loadCategory,loadCategoryItems,loadEachItem,commonSearch,page404,pagination,sortData };