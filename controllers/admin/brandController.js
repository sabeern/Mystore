const brandSchema = require('../../models/admin/brandModel')
function trimFunction(val) {
    return val.trim();
}
const brand = (req, res) => {
    res.render('./admin/brand/brandForm',{errMsg:req.flash('existErr')});
}
const addBrand = async (req, res) => {
    let { brandName } = req.body;
    brandName = trimFunction(brandName);
    const newBrand = new brandSchema({
        brandName,
        delFlag: 0
    });
    try {
        await newBrand.save();
    }catch(err) {
        req.flash('existErr','Brand already exist');
        res.redirect('/admin/brand');
        return;
    }
    res.redirect('/admin/brand/brandList');
}
const brandList = async (req,res) => {
    const brands = await brandSchema.aggregate([{$match:{delFlag:0}},{$lookup:{from:process.env.PRODUCT_COLLECTION,
        localField:'_id',foreignField:'productBrandId',as:'usedBrands'}},{$sort:{brandName:1}}]);
    res.render('./admin/brand/brandList',{brands});
}
const brandEdit = async (req,res) => {
    const {brandEdit} = req.body;
    const result = await brandSchema.findOne({$and:[{_id:brandEdit},{delFlag:0}]});
    if(!result) {
        res.redirect('/admin/brand/brandList');      
        return;
    }
    res.render('./admin/brand/editBrandForm',{result});
}
const updateBrand = async (req,res) => {
    let {brandId,brandName} = req.body;
    brandName = brandName.trim();
    await brandSchema.findByIdAndUpdate(brandId,{brandName})
    res.redirect('/admin/brand/brandList');
}
const deleteBrand = async (req,res) => {
    let {brandDelete} = req.body;
     await brandSchema.findByIdAndDelete(brandDelete);
    res.send({result:'deleted'});
}

module.exports = { brand, addBrand, brandList, brandEdit, updateBrand,deleteBrand };