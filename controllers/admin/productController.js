const multer = require('multer');
const categoryModel = require('../../models/admin/categoryModel');
const brandModel = require('../../models/admin/brandModel');
const subCategoryModel = require('../../models/admin/subCategoryModel');
const productModel = require('../../models/admin/productModel');
const fileStorageEngine = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,process.env.PRODUCT_UPLOAD_PATH);
    },
    filename:(req,file,cb) => {
        cb(null,Date.now()+file.originalname);
    }
  });
const fileFilter = (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
const upload = multer({storage:fileStorageEngine,fileFilter});  
const uploadSingleImage = upload.single('productImage');
function trimFunction(val) {
    return val.trim();
}
const product = async (req, res) => {
    const category = await categoryModel.find({delFlag:0});
    const brand = await brandModel.find({delFlag:0});
    let errMsg = false;
    res.render('./admin/product/productForm',{category,brand,errMsg:req.flash('message')[0]});
}
const addProduct = (req,res) => {
    uploadSingleImage(req,res,async err => {
        if(err) {
            req.flash('message', 'Image File not Supported');
            res.redirect('/admin/product');
            return;
        }
        try {
            const productImage = req.file.filename;
        const { productName, productDescription, productCategoryId, productSubCategoryId, productBrandId, productStock,productPrice, productMrp } = req.body;
        const newProduct = new productModel({
            productName, productDescription, productCategoryId, productSubCategoryId, productBrandId, productStock,productPrice, productMrp,productImage, delFlag:0
        });
            await newProduct.save();
        }
        catch (err) {
            req.flash('message', 'Product not Added, Failed');
            res.redirect('/admin/product');
            return;
        }
        res.redirect('/admin/product/productList');
    });
}
const loadSubcategory = async (req,res) => {
    const {categoryId} = req.body;
    const subCategory = await subCategoryModel.find({$and:[{categoryId},{delFlag:0}]});
    res.send({subCategory:subCategory});
}
const productList = async (req,res) => {
    let allProducts = await productModel.aggregate([{$match:{delFlag:0}},{$lookup:{from:process.env.CATEGORY_COLLECTION,localField:'productCategoryId',
    foreignField:'_id',as:'category'}},{$lookup:{from:process.env.SUBCATEGORY_COLLECTION,localField:'productSubCategoryId',foreignField:'_id',as:'subCategory'}}]);
    res.render('./admin/product/productList',{allProducts});
}
const deleteProduct = async (req,res) => {
    const {productDelete} = req.body;
    await productModel.findByIdAndUpdate(productDelete,{delFlag:1});
    res.send({msg:'deleted product'});
}
const editProduct = async (req,res) => {
    const {productEdit} = req.body;
    const editProductDetails = await productModel.findOne({$and:[{_id:productEdit},{delFlag:0}]});
    if(editProductDetails) {
        const category = await categoryModel.find({delFlag:0});
        const brand = await brandModel.find({delFlag:0});
        const subCategory = await subCategoryModel.find({$and:[{categoryId:editProductDetails.productCategoryId},{delFlag:0}]});
        res.render('./admin/product/editProductForm',{editProductDetails,category,brand,errMsg:false,subCategory});
    }else {
        res.redirect('/admin/product/productList');
    }
}
const updateProduct = (req,res) => {
    uploadSingleImage(req,res,async err => {
        const productId = req.params.id;
        const { productName, productDescription, productCategoryId, productSubCategoryId, productBrandId, productStock,productPrice, productMrp } = req.body;
        if(req.file) {
            console.log('hi');
            if(err) {
                console.log('error');
                req.flash('message', 'Image File not Supported, Updation Failed');
                res.redirect('/admin/product');
                return;
            }
            try {
                const productImage = req.file.filename;
            await productModel.findByIdAndUpdate(productId,{
                productName, productDescription, productCategoryId, productSubCategoryId, productBrandId, productStock,productPrice, productMrp,productImage
            });
            }
            catch (err) {
                req.flash('message', 'Product not Updated, Updation Failed');
                res.redirect('/admin/product');
            }
            res.redirect('/admin/product/productList');
        }else {
            await productModel.findByIdAndUpdate(productId,{
                productName, productDescription, productCategoryId, productSubCategoryId, productBrandId, productStock,productPrice, productMrp
            });
            res.redirect('/admin/product/productList');
        }
        
    });
}
const searchProduct = async (req,res) => {
    const {searchKeyword} = req.body;
    const searchedData = await productModel.aggregate([{$match:{$and:[{productName:{$regex:new RegExp('.*'+searchKeyword+'.*','i')}},{delFlag:0}]}},{$lookup:{from:process.env.CATEGORY_COLLECTION,localField:'productCategoryId',
    foreignField:'_id',as:'category'}},{$lookup:{from:process.env.SUBcATEGORY_COLLECTION,localField:'productSubCategoryId',foreignField:'_id',as:'subCategory'}}]);
    res.send({searchedData});
}

module.exports = { product, addProduct, loadSubcategory, productList,deleteProduct,editProduct,updateProduct,searchProduct };