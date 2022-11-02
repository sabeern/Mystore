const mongoose = require('mongoose');

const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
const productSchema = mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productDescription: {
        type: String,
        required: true
    },
    productCategoryId: {
        type: ObjectId,
        required: true
    },
    productSubCategoryId: {
        type: ObjectId,
        required: true
    },
    productBrandId: ObjectId,
    productStock: {
        type: Number,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    productMrp: {
        type: Number,
        required: true
    },
    productImage: {
        type: String,
        required: true
    },
    offerType: String,
    offerValue: Number,
    delFlag:{
        type:Number,
        required:true
    }
});

module.exports = mongoose.model(process.env.PRODUCT_COLLECTION, productSchema);