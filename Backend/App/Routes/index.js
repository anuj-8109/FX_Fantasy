module.exports = function (app) {
    app.use(require("./Users"))
    app.use(require("./BasicSetting"))
    app.use(require("./Mailtemplate"))
    app.use(require("./Smstemplate"))
    app.use(require("./Smsprovider"))
    app.use(require("./Content"))
    app.use(require("./Blogs"))
    app.use(require("./News"))
    app.use(require("./Coupon"))
    app.use(require("./Faq"))
    app.use(require("./Banner"))

}