const packingSchema = require('../../models/admin/packingModel');
function trimFunction(val) {
    return val.trim();
}
const packing = (req, res) => {
    res.render('./admin/packing/packingForm');
}
const addPacking = async (req, res) => {
    let { packingType } = req.body;
    packingType = trimFunction(packingType);
    const newPacking = new packingSchema({
        packingType,
        delFlag: 0
    });
    await newPacking.save();
    res.redirect('/admin/packing');
}

module.exports = { packing, addPacking };