const subcategoryModel = require('../../models/admin/subCategoryModel');
const bannerModel = require('../../models/admin/bannerModel');
const multer = require('multer');

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.BANNER_IMAGE_PATH);
    },
    filename: (req, file, cb) => {
        let newFilename = file.originalname.replace(' ','_');
        cb(null, Date.now() + newFilename);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
    } else {
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
}
const upload = multer({ storage: fileStorageEngine, fileFilter });
const uploadSingleImage = upload.single('baneerImage');
const banner = async (req,res) => {
    const subcategories = await subcategoryModel.find({delFlag:0});
    res.render('./admin/homeBanner',{subcategories,message:req.flash('message'),errMsg:req.flash('errMsg')});
}
const addBanner = async (req,res) => {
    uploadSingleImage(req, res, async err => {
        if (err) {
            req.flash('errMsg', 'Image File not Supported');
            res.redirect('/admin/banner');
            return;
        }
        try {
            const { text1,mainText,text2,targetLink } = req.body;
            const bannerImage = req.file.filename;
            const bannerDetails = new bannerModel({
                bannerText1:text1,bannerMainText:mainText,bannerText2:text2,targetLink,bannerImage
            });
            await bannerDetails.save();
        } catch (err) {
            req.flash('errMsg', 'Banner adding failed');
            res.redirect('/admin/banner');
            return;
        }
        req.flash('message', 'New banner added');
        res.redirect('/admin/banner');
    });

}

module.exports = { banner,addBanner };