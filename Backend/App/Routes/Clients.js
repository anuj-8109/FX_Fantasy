const router = require("express").Router()
const auth = require('../Middleware/auth');

const {AddClient,updateClient,deleteClient,detailClient,statusChange,activeClient,deActiveClient,getClientWithFilter,getClientWithFilterExcel,getDeleteClientWithFilter} = require('../Controllers/Clients')



router.post('/client/add', auth, AddClient);
router.post('/client/listwithfilter', auth, getClientWithFilter);
router.post('/client/deletelistwithfilter', auth, getDeleteClientWithFilter);

router.get('/client/listwithfilterexcel', auth, getClientWithFilterExcel);

router.put('/client/update', auth, updateClient);
router.get('/client/delete/:id', auth, deleteClient);
router.get('/client/detail/:id', auth, detailClient);
router.post('/client/change-status', auth, statusChange);

module.exports = router;
