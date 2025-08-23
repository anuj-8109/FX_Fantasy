const router = require("express").Router()
const auth = require('../Middleware/auth');


const {AddBlogs,getBlogs,updateBlogs,deleteBlogs,detailBlogs,statusChange,activeBlogs} = require('../Controllers/Blogs')



router.post('/blogs/add', auth, AddBlogs);
router.get('/blogs/list', auth, getBlogs);
router.post('/blogs/update', auth, updateBlogs);
router.get('/blogs/delete/:id', auth, deleteBlogs);
router.get('/blogs/detail/:id', auth, detailBlogs);
router.post('/blogs/change-status', auth, statusChange);
router.get('/blogs/activeblogs', auth,   activeBlogs);


module.exports = router;
