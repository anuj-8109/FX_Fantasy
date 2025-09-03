const router = require("express").Router()
const auth = require('../../Middleware/authClient');

const {detailClient,deleteClient,requestPayout,payoutList,referEarn,getTickets,detailTicket,rePly,addTicket,LoginWithOTP,otpSubmitWithPhone,updateClientProfile,Logout} = require('../Controllers/Clients')


router.post("/api/client/login-with-otp", LoginWithOTP);
router.post("/api/client/otpsubmitwithphone", otpSubmitWithPhone);
router.post("/api/client/updateclientprofile", auth, updateClientProfile);
router.get('/api/client/detail/:id', auth, detailClient);
router.get('/api/client/logout/:id', auth, Logout); 
router.get('/api/client/deleteclient/:id', auth, deleteClient);
router.post('/api/client/payoutlist', auth, payoutList);
router.post('/api/client/requestpayout', auth, requestPayout);
router.post('/api/client/referearn', auth, referEarn);
router.post('/api/client/gettickets', auth, getTickets);
router.get('/api/client/ticketdetail/:ticketid', auth, detailTicket);
router.post('/api/client/ticketreply', auth, rePly);
router.post('/api/client/addticket', auth, addTicket);

module.exports = router;
