const router = require("express").Router()
const auth = require('../../Middleware/authClient');

const {Bannerlist,Couponlist,Faqlist,detailContent,basicSetting,BlogslistwithPagination,NewslistwithPagination,getUpcomingTournaments,getContestsByTournamentId,joinContest,addTrade} = require('../Controllers/List')


router.get('/api/list/blogspagination', auth, BlogslistwithPagination);
router.get('/api/list/newspagination', auth, NewslistwithPagination);
router.get('/api/list/banner', auth, Bannerlist); 
router.get('/api/list/coupon', auth, Couponlist);
router.get('/api/list/faq', auth, Faqlist);
router.get('/api/list/content/:id', auth, detailContent);
router.get('/api/list/basicsetting', auth, basicSetting); 
router.get('/api/list/getupcomingtournaments', auth, getUpcomingTournaments); 
router.get('/api/list/getcontestsbytournamentid/:tournament_id', auth, getContestsByTournamentId); 
router.post('/api/list/joincontest', auth, joinContest); 
router.post('/api/list/buyselltrade', auth, addTrade); 


module.exports = router;
