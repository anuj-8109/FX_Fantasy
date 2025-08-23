const router = require("express").Router()
const auth = require('../Middleware/auth');

const {AddContent,getContent,updateContent,deleteContent,detailContent,statusChange,activeContent} = require('../Controllers/Content')



router.post('/content/add', auth, AddContent);
router.get('/content/list', auth, getContent);
router.put('/content/update', auth, updateContent);
router.get('/content/delete/:id', auth, deleteContent);
router.get('/content/detail/:id', auth, detailContent);
router.post('/content/change-status', auth, statusChange);
router.get('/content/activecontent', auth,   activeContent);

module.exports = router;
