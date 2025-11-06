const router = require("express").Router()
const auth = require('../../Middleware/authClient');

const {detailClient,deleteClient,requestPayout,payoutList,referEarn,getTickets,detailTicket,rePly,addTicket,LoginWithOTP,otpSubmitWithPhone,updateClientProfile,Logout,addMoneyInWallet,getWalletHistory,updateClientName,updateClientImage,clientKycAndAgreement,uploadDocuments,downloadDocuments,updateClientManualkyc,addBankDetail,listBankDetails,deleteBank,AddContestPrivate,SharePrivateContest,ListPrivateContests,Refer,myContestsWithoutTournament,googleAuth,googleCallback} = require('../Controllers/Clients')


router.post("/api/client/login-with-otp", LoginWithOTP);
router.post("/api/client/otpsubmitwithphone", otpSubmitWithPhone);
router.post("/api/client/updateclientprofile", auth, updateClientProfile);
router.post("/api/client/updateclientname", auth, updateClientName);
router.post("/api/client/updateclientimage", auth, updateClientImage);
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
router.post('/api/client/addmoneyinwallet', auth, addMoneyInWallet);
router.post('/api/client/getwallethistory', auth, getWalletHistory);
router.post('/api/client/clientkycandagreement', auth, clientKycAndAgreement);
router.get('/api/client/uploaddocuments', auth, uploadDocuments);
router.get('/api/client/downloaddocuments', auth, downloadDocuments);
router.post("/api/client/manualkyc", auth, updateClientManualkyc);
router.post("/api/client/addbankdetail", auth, addBankDetail);
router.get("/api/client/listbankdetails", auth, listBankDetails);
router.get("/api/client/deletebank", auth, deleteBank);
router.post("/api/client/addcontestprivate", auth, AddContestPrivate);
router.post("/api/client/shareprivatecontest", auth, SharePrivateContest);
router.get("/api/client/listprivatecontests", auth, ListPrivateContests);
router.get("/api/client/refer", Refer);
router.post('/api/list/mycontestswithouttournament', auth, myContestsWithoutTournament); 


router.get('/api/client/google', googleAuth);
router.get('/api/client/callback', googleCallback);

module.exports = router;
