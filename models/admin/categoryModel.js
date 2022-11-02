const mongoose = require('mongoose');
const categorySchema = mongoose.Schema({
    categoryName: {
        type: String,
        required: true
    },
    delFlag: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model(process.env.CATEGORY_COLLECTION, categorySchema);