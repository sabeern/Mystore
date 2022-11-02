const mongoose = require('mongoose');

const userShema = mongoose.Schema({
    userName:String,
    userEmail:{
        type:String,
        required:true,
        unique:true
    },
    userMobile:String,
    userPassword:{
        type:String,
        required:true
    },
    userStatus:{
        type:String,
        required:true
    },
    userType:{
        type:String,
        required:true 
    },
    userAddress:[
        {
            fullName:{
                type:String,
                required:true
            },
            mobileNumber:{
                type:String,
                required:true
            },
            pincode:String,
            locality:String,
            address:{
                type:String,
                required:true
            },
            district:String,
            state:String
        }
    ],
    gender:String,
    delFlag:{
        type:Number,
        required:true
    }
});

module.exports = mongoose.model(process.env.USER_COLLECTION,userShema);