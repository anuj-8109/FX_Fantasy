const router = require("express").Router()
const auth = require('../Middleware/auth');


const {AddCoupon,getCoupon,updateCoupon,deleteCoupon,detailCoupon,statusChange,activeCoupon,showStatusChange} = require('../Controllers/Coupon')


router.post('/coupon/add', auth, AddCoupon);
router.get('/coupon/list', auth, getCoupon);
router.put('/coupon/update', auth, updateCoupon);
router.get('/coupon/delete/:id', auth, deleteCoupon);
router.get('/coupon/detail/:id', auth, detailCoupon);
router.post('/coupon/change-status', auth, statusChange);
router.post('/coupon/show-change-status', auth, showStatusChange);
router.get('/coupon/activecoupon', auth,   activeCoupon);


module.exports = router;
