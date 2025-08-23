"use strict";

require('dotenv').config();
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const Cities_Model = require("../Models/Cities");
const path = require('path');
// Load your JSON file (adjust path if needed)
const cities = require(path.join(__dirname, "../../uploads/json/cities.json"));


async function seedCities() {
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME,
  });

  for (const city of cities) {
    // Convert string id to ObjectId
    const _id = new ObjectId(city._id.$oid || city._id);
    const data = {
      _id,
      city: city.city,
      state: city.state
    };

    // Use upsert: true to avoid duplicates
    await Cities_Model.updateOne(
      { _id },
      { $set: data },
      { upsert: true }
    );
  }

  // await mongoose.disconnect();
}

module.exports = seedCities;
