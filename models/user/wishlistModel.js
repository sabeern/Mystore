const mongoose = require('mongoose');

const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
const wishlistSchema = mongoose.Schema({
    userId:{
        type:ObjectId,
        required:true
    },
    wishlistItems:[
        {
            productId:{
                type:ObjectId,
                required:true
            }
        }
    ]
});

module.exports = mongoose.model(process.env.WISHLIST_COLLECTION,wishlistSchema);