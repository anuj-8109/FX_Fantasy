const router = require("express").Router();
const auth = require('../Middleware/auth');
const {
    AddContest,
    getContests,
    updateContest,
    deleteContest,
    detailContest,
    statusChange,
    statusChangeActive,
    getStock
} = require('../Controllers/Contest');

router.post('/contest/add', auth, AddContest);
router.get('/contest/list', auth, getContests);
router.post('/contest/update', auth, updateContest);
router.get('/contest/delete/:id', auth, deleteContest);
router.get('/contest/detail/:id', auth, detailContest);
router.post('/contest/change-status', auth, statusChange);
router.post('/contest/change-status-active', auth, statusChangeActive);
router.get('/contest/stocklist', auth, getStock);


module.exports = router;
