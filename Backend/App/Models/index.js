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

    States:States,
    City:City,
   


}