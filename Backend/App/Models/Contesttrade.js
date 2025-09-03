"use strict";

const { Schema, model } = require('mongoose');

const ContesttradeSchema  = new Schema({
    contest_id: { type: Schema.Types.ObjectId, ref: "Contest", required: true },
  client_id: { type: Schema.Types.ObjectId, ref: "CLIENTS", required: true },
  stock_symbol: { type: String, required: true },
  trade_type: { type: String, enum: ["buy", "sell"], required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  trade_time: { type: Date, default: Date.now }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Define the model
const Contesttrade = model('Contesttrade', ContesttradeSchema);

module.exports = Contesttrade;
