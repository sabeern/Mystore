const mongoose = require('mongoose');

const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
const cartSchema = mongoose.Schema({
    userId:{
        type:ObjectId,
        required:true
    },
    cartItems:[
        {
            productId:{
                type:ObjectId,
                required:true
            },
            productQuantity:{
                type:Number,
                required:true
            }
        }
    ]
});

module.exports = mongoose.model(process.env.CART_COLLECTION,cartSchema);