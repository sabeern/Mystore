const adminSchema = require('../../models/admin/adminModel');
const orderModel = require('../../models/user/orderModel');
const bcrypt = require('bcrypt');
function trimFunction(val) {
    return val.trim();
}

const addAdmin = async (req,res) => {
    const password = await bcrypt.hash('admin123',10);
    const adminDetails = new adminSchema({
        userName:'sabeer',password,status:'active',userType:'admin'
    });
    try {
        await adminDetails.save();
    } catch(err) {
        
    }
    res.redirect('/');
}

const loginLoad = (req, res) => {
    let authErr = '';
    if (req.session.authErr) {
        authErr = req.session.authErr;
        req.session.authErr = '';
    }
    res.render('./admin/loginForm', { authErr });
}
const loginCheck = async (req, res) => {
    let { UserName, Password } = req.body;
    UserName = trimFunction(UserName);
    Password = trimFunction(Password);
    const result = await adminSchema.findOne({ userName: UserName });
    if (result) {
        if (result.status == 'active') {
            const checkStatus = await bcrypt.compare(Password, result.password);
            if (checkStatus) {
                req.session.admin = { userName: result.userName, userType: result.userType };
                res.redirect('/admin/dashboard');
            } else {
                req.session.authErr = 'Username or password incorrect';
                res.redirect('/admin');
            }
        } else {
            req.session.authErr = 'Account not active';
            res.redirect('/admin');
        }
    } else {
        req.session.authErr = 'Username or password incorrect';
        res.redirect('/admin');
    }
}
const adminDashboard = async (req, res) => {
    let startDate = new Date();
    startDate.setUTCHours(0,0,0,0);
    const day = startDate.getDate();
    startDate.setDate( startDate.getDate() - (day-1) );
    let endDate = new Date();
    const lastMonthSale = await orderModel.aggregate([{$match:{delFlag:0,orderStatus:{$nin:['pending','canceled']},orderDate:{$gte:startDate,$lte:endDate}}},{$group:{_id:null,monthlySale:{$sum:'$totalAmount'}}}]);
    const pendingOrders = await orderModel.aggregate([{$match:{delFlag:0,orderStatus:'approved'}},{$sort:{deliveryDate:1}}]);
    const topCusomers = await orderModel.aggregate([{$match:{delFlag:0,orderStatus:{$nin:['pending','canceled']}}},{$group:{_id:'$userId',totalPurchase:{ $sum:'$totalAmount'}}},{$sort:{totalPurchase:-1}},{$limit:6},
                                {$lookup:{from:process.env.USER_COLLECTION,localField:'_id',foreignField:'_id',as:'customer'}}]);
    res.render('./admin/dashboard',{lastMonthSale,pendingOrders,topCusomers});
}
const monthlySalesLoad = async (req,res) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    let startDate = new Date('01-01-'+currentYear);
    startDate.setHours(5,31,0,0);
    let endDate = new Date('12-31-'+currentYear);
    endDate.setHours(29,29,0,0);
    const monthlySales = await orderModel.aggregate([{$match:{delFlag:0,orderStatus:{$nin:['pending','canceled']},orderDate:{$gte:startDate,$lte:endDate}}},{$group:{_id: {$substr: ['$orderDate', 5, 2]},sales:{$sum:'$totalAmount'}}}]);
    const orderStatusCount = await orderModel.aggregate([{$match:{delFlag:0,orderDate:{$gte:startDate,$lte:endDate}}},{$group:{_id:'$orderStatus',count:{ "$sum": 1 }}}]);
    res.send({monthlySales,orderStatusCount});
}
const logout = (req, res) => {
    if(req.session.user){
        req.session.admin = false;
    }else {
        req.session.destroy();
    }
    res.redirect('/admin');
}
const salesReport = (req,res) => {
    res.render('./admin/salesReport');
}
const generateSalesReport = async (req,res) => {
    let { startDate,endDate,reportType } = req.body;
    startDate = new Date(startDate);
    startDate.setHours(5,31,0,0);
    endDate = new Date(endDate);
    endDate.setHours(5,31,0,0);
    let monthlySale =false, customerSale = false, categorySale = false;
    if(reportType == 'month') {
        monthlySale = await orderModel.aggregate([{$match:{delFlag:0,orderStatus:{$nin:['pending','canceled']},orderDate:{$gte:startDate,$lte:endDate}}},
                    {$group:{_id: {$substr: ['$orderDate', 0, 7]},sales:{$sum:'$totalAmount'}}}]);
    }else if(reportType == 'customer') {
        customerSale = await orderModel.aggregate([{$match:{delFlag:0,orderStatus:{$nin:['pending','canceled']},orderDate:{$gte:startDate,$lte:endDate}}},{$group:{_id:'$userId',totalPurchase:{ $sum:'$totalAmount'}}},{$sort:{totalPurchase:-1}},
                             {$lookup:{from:process.env.USER_COLLECTION,localField:'_id',foreignField:'_id',as:'customer'}}]);
    }else if(reportType == 'category') {
        categorySale = await orderModel.aggregate([{$match:{delFlag:0,orderStatus:{$nin:['pending','canceled']},orderDate:{$gte:startDate,$lte:endDate}}},
                        {$unwind:'$orderItems'},{$project:{total: { $multiply: [ "$orderItems.productQuantity", "$orderItems.productPrice" ] },productId:'$orderItems.productId',_id:0}},
                        {$lookup:{from:process.env.PRODUCT_COLLECTION,localField:'productId',foreignField:'_id',as:'product'}},
                        {$unwind:'$product'},{$project:{total:'$total',categoryId:'$product.productCategoryId'}},
                        {$group:{_id:'$categoryId',categorySale:{$sum:'$total'}}},
                        {$lookup:{from:process.env.CATEGORY_COLLECTION,localField:'_id',foreignField:'_id',as:'category'}},{$unwind:'$category'},{$sort:{categorySale:-1}}]);
    }
    res.send({monthlySale,customerSale,categorySale});
}
const searchOrder = async (req,res) => {
    const {orderId} = req.body;
    const orderObjectId = await orderModel.findOne({orderId},{_id:1});
    if(orderObjectId) {
        res.send({objectId:orderObjectId._id});
    }else {
        res.send({message:'No order found'});
    }
}

module.exports = { loginLoad, loginCheck, adminDashboard, logout, monthlySalesLoad,salesReport,generateSalesReport,searchOrder,addAdmin };