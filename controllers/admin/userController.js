const userModel = require('../../models/user/userModel');
const mongoose = require('mongoose');

const userList = async (req,res) => {
    const users = await userModel.find({delFlag:0}).sort({userName:1});
    res.render('./admin/user/userList',{users});
}
const viewDetails = async (req,res) => {
    const { userId } = req.body;
    const user = await userModel.findOne({$and:[{_id:userId},{delFlag:0}]});
    res.send({user});
}
const blockUser = async (req,res) => {
    let { userId,userStatus } = req.body;
    let updateStatus;
    if(userStatus == 'active') {
        updateStatus = 'blocked';
    }else {
        updateStatus = 'active';
    }
    userId = mongoose.Types.ObjectId(userId);
    await userModel.findByIdAndUpdate(userId,{userStatus:updateStatus});
    res.redirect('/admin/user/userList');
}
const searchUser = async (req,res) => {
    const { searchUserContent } = req.body;
    const matchingUser = await userModel.aggregate([{$match:{delFlag:0}},{$match:{$or:[{userName:{$regex:new RegExp('.*'+searchUserContent+'.*','i')}},
                        {userEmail:{$regex:new RegExp('.*'+searchUserContent+'.*','i')}},{userMobile:{$regex:new RegExp('.*'+searchUserContent+'.*','i')}}]}},
                    {$sort:{userName:1}}]);
    res.send({matchingUser});
}

module.exports = { userList,viewDetails,blockUser,searchUser };