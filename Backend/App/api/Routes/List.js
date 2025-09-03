const router = require("express").Router()
const auth = require('../../Middleware/authClient');

const {Bannerlist,Couponlist,Faqlist,detailContent,basicSetting,BlogslistwithPagination,NewslistwithPagination,Logout} = require('../Controllers/List')


router.get('/api/list/blogspagination', auth, BlogslistwithPagination);
router.get('/api/list/newspagination', auth, NewslistwithPagination);
router.get('/api/list/banner', auth, Bannerlist); 
router.get('/api/list/coupon', auth, Couponlist);
router.get('/api/list/faq', auth, Faqlist);
router.get('/api/list/content/:id', auth, detailContent);
router.get('/api/list/basicsetting', auth, basicSetting); 


module.exports = router;
