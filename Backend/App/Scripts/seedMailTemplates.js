"use strict";

require('dotenv').config();
const mongoose = require('mongoose');

// 1️⃣ Load model using your existing pattern
const db = require("../Models"); // Make sure App/models/index.js exports Role
const Mailtemplate_Modal = db.Mailtemplate;

async function seedMailTemplates() {
  try {
    // ✅ Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    });

    // 2️⃣ Define MailTemplate seed data
    const templatesToSeed = [
      {
        _id: "66f6581201cc91347391827a",
        mail_type: "client_verification_mail",
        mail_subject: "Verification Mail",
        mail_body: `Dear Users
Your verification code is {resetToken}. This code is valid for 10 minutes. Please do not share this codea with anyone.`,
      },
      {
        _id: "66f6586e01cc91347391827b",
        mail_type: "staff_reset_password",
        mail_subject: "Password Reset",
        mail_body: `You are receiving this because you (or someone else) have requested to reset the password for your account.\n\n
               Please click on the following link, or paste it into your browser to complete the process:\n\n
               {url}
               If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      },
      {
        _id: "66f674d601cc913473918286",
        mail_type: "client_password_reset",
        mail_subject: "Password Reset",
        mail_body: `Your verification code is: {resetToken}. This code is valid for 10 minutes. Please do not share this code with anyone.`,
      },
      {
        _id: "66fb89d2a9dc1ed3c13fe952",
        mail_type: "welcome_mail",
        mail_subject: "Welcome Mail",
        mail_body: `Dear Client,
Welcome to {company_name}! We are excited to have you on board.

Here are your account details for accessing our platform:

    Username: {username}
    Password: {password}

For security purposes, we recommend changing your password after your first login.

We look forward to helping you on your journey with {compamy_name}!`,
      },
      {
        _id: "677b9b459d79fba3a08c65db",
        mail_type: "invoice",
        mail_subject: "Invoice",
        mail_body: `Hi {clientName},
      We are pleased to inform you that your plan has been successfully purchased!`,
      },
      {
        _id: "67eb73de1da8c1a764688b91",
        mail_type: "kyc",
        mail_subject: "Kyc Agreement",
        mail_body: `Hi {clientName},
We are pleased to inform you that your KYC verification has been successfully completed!`,
      }
    ];

    // 3️⃣ Insert each one if not exists
    for (const tpl of templatesToSeed) {
      const exists = await Mailtemplate_Modal.findById(tpl._id);
      if (!exists) {
        await Mailtemplate_Modal.create(tpl);
      } else {
      }
    }

  } catch (err) {
  } finally {
    // mongoose.disconnect();
  }
}

module.exports = seedMailTemplates;
