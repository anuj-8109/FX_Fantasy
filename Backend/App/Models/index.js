const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_URI

const client = new MongoClient(uri);
const db_GET_VIEW = client.db(process.env.DB_NAME);

const States = db_GET_VIEW.collection('states');
const City = db_GET_VIEW.collection('cities');


module.exports = {

    Users: require("./Users"),
    BasicSetting: require("./BasicSetting"),
    Mailtemplate: require("./Mailtemplate"),
    Content: require("./Content"),
    Smstemplate: require("./Smstemplate"),
    Smsprovider: require("./Smsprovider"),
    Role: require("./Role"),
    Statess :require("./States"),
    Cities :require("./Cities"),
    Blogs: require("./Blogs"),
    News: require("./News"),
    Coupon: require("./Coupon"),
    Banner: require("./Banner"),
    Faq: require("./Faq"),
    Clients: require("./Clients"),
    Ticket: require("./Ticket"),
    Ticketmessage: require("./Ticketmessage"),
    Stock: require("./Stock"),
    Notification: require("./Notification"),
    Adminnotification: require("./Adminnotification"),
    Refer: require("./Refer"),
    Payout: require("./Payout"),
    Bank: require("./Bank"),
    Moneyhistory: require("./Moneyhistory"),
    Contest: require("./Contest"),
    Contestjoin: require("./Contestjoin"),
    Tournament: require("./Tournament"),
    Contesttrade: require("./Contesttrade"),  // Add this line to export the
    Wallet: require("./Wallet"),  // Add this line to export the
    ContestShare: require("./ContestShare"),  // Add this line to export the


    States:States,
    City:City,
   


}