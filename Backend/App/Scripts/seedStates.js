"use strict";

require('dotenv').config();
const mongoose = require('mongoose');
const db = require("../Models"); // Make sure App/models/index.js exports Role
const States_Modal = db.Statess;

async function seedStates() {
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME,
  });
  const { Types } = mongoose;
  const statesToSeed = [
    { _id: new Types.ObjectId("67f7c69f807e12091e494e01"), code: "AN", id: 35, name: "Andaman and Nicobar Islands" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e02"), code: "AP", id: 28, name: "Andhra Pradesh" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e03"), code: "AR", id: 12, name: "Arunachal Pradesh" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e04"), code: "AS", id: 18, name: "Assam" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e05"), code: "BR", id: 10, name: "Bihar" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e06"), code: "CH", id: 4, name: "Chandigarh" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e07"), code: "CG", id: 22, name: "Chhattisgarh" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e08"), code: "DN", id: 26, name: "Dadra and Nagar Haveli" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e09"), code: "DD", id: 25, name: "Daman and Diu" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e10"), code: "DL", id: 7, name: "Delhi" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e11"), code: "GA", id: 30, name: "Goa" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e12"), code: "GJ", id: 24, name: "Gujarat" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e13"), code: "HR", id: 6, name: "Haryana" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e14"), code: "HP", id: 2, name: "Himachal Pradesh" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e15"), code: "JK", id: 1, name: "Jammu and Kashmir" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e16"), code: "JH", id: 20, name: "Jharkhand" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e17"), code: "KA", id: 29, name: "Karnataka" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e18"), code: "KL", id: 32, name: "Kerala" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e19"), code: "LA", id: 37, name: "Ladakh" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e20"), code: "LD", id: 31, name: "Lakshadweep" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e21"), code: "MP", id: 23, name: "Madhya Pradesh" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e22"), code: "MH", id: 27, name: "Maharashtra" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e23"), code: "MN", id: 14, name: "Manipur" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e24"), code: "ML", id: 17, name: "Meghalaya" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e25"), code: "MZ", id: 15, name: "Mizoram" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e26"), code: "NL", id: 13, name: "Nagaland" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e27"), code: "OR", id: 21, name: "Odisha" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e28"), code: "PY", id: 34, name: "Puducherry" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e29"), code: "PB", id: 3, name: "Punjab" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e30"), code: "RJ", id: 8, name: "Rajasthan" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e31"), code: "SK", id: 11, name: "Sikkim" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e32"), code: "TN", id: 33, name: "Tamil Nadu" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e33"), code: "TG", id: 36, name: "Telangana" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e34"), code: "TR", id: 16, name: "Tripura" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e35"), code: "UP", id: 9, name: "Uttar Pradesh" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e36"), code: "UK", id: 5, name: "Uttarakhand" },
    { _id: new Types.ObjectId("67f7c69f807e12091e494e37"), code: "WB", id: 19, name: "West Bengal" }
  ];

  for (const state of statesToSeed) {
    const exists = await States_Modal.findOne({ name: state.name });
    if (!exists) {
      await States_Modal.create(state);
    } else {
    }
  }

  // await mongoose.disconnect();
}

module.exports = seedStates;
