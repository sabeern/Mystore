const mongoose = require('mongoose');
const brandSchema = mongoose.Schema({
    brandName: {
        type: String,
        required: true
    },
    delFlag: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model(process.env.BRAND_COLLECTION, brandSchema);