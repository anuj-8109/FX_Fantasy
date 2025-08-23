const router = require("express").Router()
const auth = require('../Middleware/auth');

const {AddFaq,getFaq,updateFaq,deleteFaq,detailFaq,statusChange,activeFaq} = require('../Controllers/Faq')


router.post('/faq/add', auth, AddFaq);
router.get('/faq/list', auth, getFaq);
router.put('/faq/update', auth, updateFaq);
router.get('/faq/delete/:id', auth, deleteFaq);
router.get('/faq/detail/:id', auth, detailFaq);
router.post('/faq/change-status', auth, statusChange);
router.get('/faq/activefaq', auth,   activeFaq);

module.exports = router;
