const router = require("express").Router()

const {AddBulkStockCron,DeleteTokenAliceToken,TournamentStatusChange,updateContestRanks} = require('../Controllers/Cron')



router.get('/cron/add', AddBulkStockCron);
router.get('/cron/delete', DeleteTokenAliceToken);
router.get('/cron/tournament-status-change', TournamentStatusChange);
router.get('/cron/updatecontestranks', updateContestRanks);


module.exports = router;
