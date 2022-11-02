const orderModel = require('../../models/user/orderModel');
const mongoose = require('mongoose');

const orderList = async (req,res) => {
    const orders = await orderModel.aggregate([{$match:{delFlag:0}},
                    {$lookup:{from:process.env.USER_COLLECTION,localField:'userId',foreignField:'_id',as:'user'}},
                    {$sort:{orderDate:-1}}]);
    res.render('./admin/order/orderList',{orders});
}
const updateOrderStatus = async (req,res) => {
    const { orderStatus,orderId } = req.body;
    await orderModel.findByIdAndUpdate(orderId,{orderStatus});
    res.redirect('/admin/order/orderList');
}
const deleteOrder = async (req,res) => {
    const { orderId } = req.body;
    await orderModel.findByIdAndUpdate(orderId,{delFlag:1});
    res.redirect('/admin/order/orderList');
}
const viewUserDetails = async (req,res) => {
    let orderId = req.params.id;
    try {
            orderId = mongoose.Types.ObjectId(orderId);
        }catch (err){
                    res.redirect('/admin/order/orderList');
                    return;
            }
    let orderDetail;
        orderDetail = await orderModel.aggregate([{$match:{_id:orderId,delFlag:0}},{$lookup:{from:process.env.USER_COLLECTION,localField:'userId',foreignField:'_id',as:'user'}},{$unwind:'$orderItems'},
                            {$lookup:{from:process.env.PRODUCT_COLLECTION,localField:'orderItems.productId',foreignField:'_id',as:'product'}}]);
            res.render('./admin/order/userOrder',{orderDetail});
}

module.exports = { orderList,updateOrderStatus,deleteOrder,viewUserDetails };