"use strict";

const { Schema, model } = require("mongoose");

const WalletSchema = new Schema(
  {
    client_id: {
      type: Schema.Types.ObjectId,
      ref: "CLIENTS", // CLIENT model reference
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["credit", "debit"], // credit = add money, debit = minus money
      required: true,
    },
    remark: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: Boolean,
      default: true, // true = active transaction
    },
    del: {
      type: Boolean,
      default: false, // false = not deleted
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Wallet = model("Wallet", WalletSchema);

module.exports = Wallet;
