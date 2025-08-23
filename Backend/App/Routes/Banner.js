const router = require("express").Router()
const auth = require('../Middleware/auth');


const {AddBanner,getBanner,updateBanner,deleteBanner,detailBanner,statusChange,activeBanner,activeBanners} = require('../Controllers/Banner')





router.post('/banner/add', auth, AddBanner);
router.get('/banner/list', auth, getBanner);
router.post('/banner/update', auth, updateBanner);
router.get('/banner/delete/:id', auth, deleteBanner);
router.get('/banner/detail/:id', auth, detailBanner);
router.post('/banner/change-status', auth, statusChange);
router.get('/banner/activebanner', auth,   activeBanner);
router.get('/banner/activebanners', auth,   activeBanners);


module.exports = router;
