const brandSchema = require('../../models/admin/brandModel')
function trimFunction(val) {
    return val.trim();
}
const brand = (req, res) => {
    res.render('./admin/brand/brandForm');
}
const addBrand = async (req, res) => {
    let { brandName } = req.body;
    brandName = trimFunction(brandName);
    const newBrand = new brandSchema({
        brandName,
        delFlag: 0
    });
    await newBrand.save();
    res.redirect('/admin/brand');
}

module.exports = { brand, addBrand };