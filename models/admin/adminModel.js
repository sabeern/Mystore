const mongoose = require('mongoose');
const adminSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model(process.env.ADMIN_COLLECTION, adminSchema);