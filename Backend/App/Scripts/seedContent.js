"use strict";

require('dotenv').config();
const mongoose = require('mongoose');

// 1️⃣ Load model using your existing pattern
const db = require("../Models"); // Make sure App/models/index.js exports Role
const Content = db.Content;

async function seedContent() {
  try {
    // ✅ Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    });

    // 2️⃣ Define Content seed data
    const contentsToSeed = [
      {
        _id: "66dbec0a9f7a0365f1f4527d",
        title: "Terms & Condition",
        description: "<p><strong>1.&nbsp;Introduction</strong></p><p>These Terms and Conditions …</p>",
        status: true,
        add_by: "66bc8b0c3fb6f1724c02bfec",
        del: false,
      },
      {
        _id: "66dbef118b3cf3e8cf23a988",
        title: "Privacy & Policy",
        description: "<h4><strong>1. Information We Collect</strong></h4><p>We may collect the …</p>",
        status: true,
        add_by: "66bc8b0c3fb6f1724c02bfec",
        del: false,
      },
      {
        _id: "66ebc51cf6b4908639cc487a",
        title: "Disclaimer",
        description: "<p>Provided on this website/application is for general informational …</p>",
        status: true,
        add_by: "66bc8b0c3fb6f1724c02bfec",
        del: false,
      }
    ];

    // 3️⃣ Insert each one if not exists
    for (const item of contentsToSeed) {
      const exists = await Content.findById(item._id);
      if (!exists) {
        await Content.create(item);
      } else {
      }
    }

  } catch (err) {
  } finally {
    // mongoose.disconnect();
  }
}

module.exports = seedContent;

