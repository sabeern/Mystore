const express = require('express');
const router = express.Router();
const staticPageController = require('../../controllers/user/staticPageController');

router.get('/aboutUs',staticPageController.aboutUs);
router.get('/secureShopping',staticPageController.secureShopping);
router.get('/termsAndCondition',staticPageController.termsNcondition);
router.get('/deliveryInformation',staticPageController.deliveryInformation);
router.get('/privacyPolicy',staticPageController.privacyPolicy);
router.get('/contactUs',staticPageController.contactUs);

module.exports = router;
