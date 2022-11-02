const express =  require('express');
const router = express.Router();
const bannerController = require('../../controllers/admin/bannerController');

router.get('/',bannerController.banner);
router.post('/addBanner',bannerController.addBanner);
module.exports  = router;