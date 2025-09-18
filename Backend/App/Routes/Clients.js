const router = require("express").Router()
const auth = require('../Middleware/auth');

const {AddClient,updateClient,deleteClient,detailClient,statusChange,getClientWithFilter,getClientWithFilterExcel,getDeleteClientWithFilter,processPayoutRequest,payoutList} = require('../Controllers/Clients')



router.post('/client/add', auth, AddClient);
router.post('/client/listwithfilter', auth, getClientWithFilter);
router.post('/client/deletelistwithfilter', auth, getDeleteClientWithFilter);

router.get('/client/listwithfilterexcel', auth, getClientWithFilterExcel);

router.put('/client/update', auth, updateClient);
router.get('/client/delete/:id', auth, deleteClient);
router.get('/client/detail/:id', auth, detailClient);
router.post('/client/change-status', auth, statusChange);
router.post('/client/process-payout-request', auth, processPayoutRequest);
router.get('/client/payoutlist', auth,  payoutList);

module.exports = router;
