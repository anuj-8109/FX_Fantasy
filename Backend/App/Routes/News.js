const router = require("express").Router()

const auth = require('../Middleware/auth');

const {AddNews,getNews,updateNews,deleteNews,detailNews,statusChange,activeNews} = require('../Controllers/News')


router.post('/news/add', auth, AddNews);
router.get('/news/list', auth, getNews);
router.post('/news/update', auth, updateNews);
router.get('/news/delete/:id', auth, deleteNews);
router.get('/news/detail/:id', auth, detailNews);
router.post('/news/change-status', auth, statusChange);
router.get('/news/activenews', auth,   activeNews);

module.exports = router;
