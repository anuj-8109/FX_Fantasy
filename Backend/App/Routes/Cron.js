const router = require("express").Router()

const {AddBulkStockCron,DeleteTokenAliceToken,TournamentStatusChange} = require('../Controllers/Cron')



router.get('/cron/add', AddBulkStockCron);
router.get('/cron/delete', DeleteTokenAliceToken);
router.get('/cron/tournament-status-change', TournamentStatusChange);



module.exports = router;
