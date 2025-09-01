const router = require("express").Router()

const {AddBulkStockCron,DeleteTokenAliceToken} = require('../Controllers/Cron')



router.get('/cron/add', AddBulkStockCron);
router.get('/cron/delete', DeleteTokenAliceToken);



module.exports = router;
