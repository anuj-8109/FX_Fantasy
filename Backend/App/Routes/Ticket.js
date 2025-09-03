const router = require("express").Router()
const auth = require('../Middleware/auth');

const {getTicketWithFilter,deleteTicket,detailTicket,rePly,statusChange} = require('../Controllers/Ticket')

router.post('/ticket/reply', auth, rePly);
router.post('/ticket/listwithfilter', auth, getTicketWithFilter);
router.get('/ticket/delete/:id', auth, deleteTicket);
router.get('/ticket/detail/:ticketid', auth, detailTicket);
router.post('/ticket/change-status', auth, statusChange);



module.exports = router;
