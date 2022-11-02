const mongoose = require('mongoose');
const packingSchema = mongoose.Schema({
    packingType: {
        type: String,
        required: true
    },
    delFlag: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model(process.env.PACKING_COLLECTION, packingSchema);