const categorySchema = require('../../models/admin/categoryModel')
function trimFunction(val) {
    return val.trim();
}
const category = (req, res) => {
    res.render('./admin/category/categoryForm');
}
const addCategory = async (req, res) => {
    let { categoryName } = req.body;
    categoryName = trimFunction(categoryName);
    const newCategory = new categorySchema({
        categoryName,
        delFlag: 0
    });
    await newCategory.save();
    res.redirect('/admin/category/categoryList');
}
const checkCategory = async (req, res) => {
    let { categoryName } = req.body;
    categoryName = trimFunction(categoryName);
    const result = await categorySchema.find({$and:[{categoryName:{$regex:new RegExp('^'+categoryName+'$','i')}},{delFlag:0}]});
    res.send({ searchResult: result });
}
const findCategories = async (req,res) => {
    const allCategories = await categorySchema.aggregate([{$match:{delFlag:0}},{$lookup:{from:process.env.SUBCATEGORY_COLLECTION,
        localField:'_id',foreignField:'categoryId',as:'usedCategory'}},{$sort:{categoryName:1}}]);
    res.render('./admin/category/categoryList',{allCategories});
}
const deleteCategory = async (req,res) => {
    let {categoryDelete} = req.body;
    categoryDelete = trimFunction(categoryDelete);
     await categorySchema.findByIdAndDelete(categoryDelete);
    res.send({result:'deleted'});
}
const editCategory = async (req,res) => {
    const {categoryEdit} = req.body;
    const result = await categorySchema.findOne({$and:[{_id:categoryEdit},{delFlag:0}]});
    if(!result) {
        res.redirect('/admin/category/categoryList');      
        return;
    }
    res.render('./admin/category/editCategoryForm',{result});
}
const updateCategory = async (req,res) => {
    const categoryId = req.params.id;
    const {categoryName} = req.body;
    await categorySchema.findByIdAndUpdate(categoryId,{categoryName})
    res.redirect('/admin/category/categoryList');
}
const searchCategory = async (req,res) => {
    const {searchKeyword} = req.body;
    const searchedData = await categorySchema.aggregate([{$match:{$and:[{categoryName:{$regex:new RegExp('.*'+searchKeyword+'.*','i')}},{delFlag:0}]}},{$lookup:{from:process.env.SUBCATEGORY_COLLECTION,
        localField:'_id',foreignField:'categoryId',as:'usedCategory'}},{$sort:{categoryName:1}}]);
    res.send({searchedData});
}

module.exports = { category, addCategory, checkCategory, findCategories, 
                    deleteCategory, editCategory, updateCategory, searchCategory };