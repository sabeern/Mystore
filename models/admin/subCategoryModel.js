const mongoose = require('mongoose');

const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
const subCategorySchema = mongoose.Schema({
    subCategoryName:{
        type:String,
        required:true
    },
    categoryId:ObjectId,
    subCategoryImage:String,
    delFlag: {
        type:Number,
        required:true
    }

});
module.exports = mongoose.model(process.env.SUBCATEGORY_COLLECTION,subCategorySchema);