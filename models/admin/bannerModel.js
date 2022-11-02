const mongoose = require('mongoose');

const bannerSchema = mongoose.Schema({
    bannerText1:String,
    bannerMainText:String,
    bannerText2:String,
    targetLink:{
        type:String,
        required:true
    },
    bannerImage:{
        type:String,
        required:true
    },
    uploadDate:{
        type:Date,
        required:true,
        default:Date.now()
    }
});

module.exports = mongoose.model(process.env.BANNER_COLLECTION,bannerSchema);