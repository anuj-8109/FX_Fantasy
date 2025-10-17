const router = require("express").Router();
const auth = require('../Middleware/auth');
const { getCount } = require('../Controllers/Dashboard');

router.get('/dashboard/getcount', auth,  getCount);



module.exports = router;
