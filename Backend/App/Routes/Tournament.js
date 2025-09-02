const router = require("express").Router();
const auth = require('../Middleware/auth');
const {
    AddTournament,
    getTournaments,
    updateTournament,
    deleteTournament,
    detailTournament,
    statusChange,
    statusChangeActive,
} = require('../Controllers/Tournament');

router.post('/tournament/add', auth, AddTournament);
router.get('/tournament/list', auth, getTournaments);
router.post('/tournament/update', auth, updateTournament);
router.get('/tournament/delete/:id', auth, deleteTournament);
router.get('/tournament/detail/:id', auth, detailTournament);
router.post('/tournament/change-status', auth, statusChange);
router.post('/tournament/change-status-active', auth, statusChangeActive);


module.exports = router;
