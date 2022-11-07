const categoryModel = require('../../models/admin/categoryModel');
const subCategoryModel = require('../../models/admin/subCategoryModel');
const multer = require('multer');

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.SUBCATEGORY_IMAGE_PATH);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
    } else {
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
}
const upload = multer({ storage: fileStorageEngine, fileFilter });
const uploadSingleImage = upload.single('subCategoryImage');
function trimFunction(val) {
    return val.trim();
}
const subCategory = async (req, res) => {
    const category = await categoryModel.find({ delFlag: 0 });
    res.render('./admin/subCategory/subCategoryForm', { category, errMsg: req.flash('message')[0] });
}
const addSubCategory = (req, res) => {
    uploadSingleImage(req, res, async err => {
        if (err) {
            console.log(err);
            req.flash('message', 'Image File not Supported');
            res.redirect('/admin/subCategory');
            return;
        }
        try {
            let { subCategoryName, categoryId } = req.body;
            subCategoryName = trimFunction(subCategoryName);
            categoryId = trimFunction(categoryId);
            const subCategoryImage = req.file.filename;
            const newSubCategory = new subCategoryModel({
                subCategoryName,
                categoryId,
                subCategoryImage,
                delFlag: 0
            });
            await newSubCategory.save();
        } catch (err) {
            req.flash('message', 'Sub-category adding failed');
            res.redirect('/admin/subCategory');
            return;
        }
        res.redirect('/admin/subCategory/subCategoryList');
    });
}
const checkSubCategory = async (req, res) => {
    let { subCategoryName, categoryId } = req.body;
    subCategoryName = trimFunction(subCategoryName);
    categoryId = trimFunction(categoryId);
    const result = await subCategoryModel.find({ $and: [{ subCategoryName: { $regex: new RegExp('^' + subCategoryName + '$', 'i') } }, { categoryId }, { delFlag: 0 }] });
    res.send({ subSearchResult: result });
}
const findSubCategories = async (req, res) => {
    const allSubCategories = await subCategoryModel.aggregate([{ $match: { delFlag: 0 } }, 
        {$lookup: {from:process.env.CATEGORY_COLLECTION,localField: 'categoryId', foreignField: '_id', as: 'category'}},
        {$lookup:{from:process.env.PRODUCT_COLLECTION,localField:'_id',foreignField:'productSubCategoryId',as:'usedSubcategory'}}
        ]);
    res.render('./admin/subCategory/subCategoryList', { allSubCategories });
}
const deleteSubCategory = async (req, res) => {
    let { subCategoryDelete } = req.body;
    subCategoryDelete = trimFunction(subCategoryDelete);
    await subCategoryModel.findByIdAndDelete(subCategoryDelete);
    res.send({ result: 'deleted' });
}
const editSubCategory = async (req, res) => {
    const { subCategoryEdit } = req.body;
    const result = await subCategoryModel.findOne({ $and: [{ _id: subCategoryEdit }, { delFlag: 0 }] });
    const category = await categoryModel.find({ delFlag: 0 })
    if (!result) {
        res.redirect('/admin/subCategory/subCategoryList');
        return;
    }
    res.render('./admin/subCategory/editSubCategoryForm', { category, result });
}
const updateCategory = async (req, res) => {
    const subCategoryId = req.params.id;
    let { subCategoryName, categoryId } = req.body;
    subCategoryName = trimFunction(subCategoryName);
    categoryId = trimFunction(categoryId);
    await subCategoryModel.findByIdAndUpdate(subCategoryId, { subCategoryName, categoryId })
    res.redirect('/admin/subCategory/subCategoryList');
}
const searchSubCategory = async (req,res) => {
    const {searchKeyword} = req.body;
    const searchedData = await subCategoryModel.aggregate([{$match:{$and:[{subCategoryName:{$regex:new RegExp('.*'+searchKeyword+'.*','i')}},{delFlag:0}]}}, 
        {$lookup: {from:process.env.CATEGORY_COLLECTION,localField: 'categoryId', foreignField: '_id', as: 'category'}},
        {$lookup:{from:process.env.PRODUCT_COLLECTION,localField:'_id',foreignField:'productSubCategoryId',as:'usedSubcategory'}}
        ]);
    res.send({searchedData});
}

module.exports = { subCategory, addSubCategory, checkSubCategory, findSubCategories, deleteSubCategory, editSubCategory, updateCategory,searchSubCategory };