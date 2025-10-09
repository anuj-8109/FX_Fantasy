"use strict";

const { Schema, model } = require('mongoose');

const ContesttradeSchema  = new Schema({
    contest_id: { type: Schema.Types.ObjectId, ref: "Contest", required: true },
  client_id: { type: Schema.Types.ObjectId, ref: "CLIENTS", required: true },
  stock_symbol: { type: String, required: true },
  trade_type: { type: String, enum: ["buy", "sell"], required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  trade_time: { type: Date, default: Date.now },
  position_type: { type: String, enum: ["OPEN", "CLOSE"], default: "OPEN" }, // OPEN = new trade, CLOSE = cover/close existing
  realizedPnL: { type: Number, default: 0 }, // profit/loss for this trade portion
  wallet_balance_after_trade: { type: Number, default: 0 }, // snapshot wallet after this trade
  locked_balance_after_trade: { type: Number, default: 0 }, // snapshot locked/reserved after this trade
  trade_reference: { type: Schema.Types.ObjectId, ref: "Contesttrade", default: null }, // link for partial trades if needed


}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Define the model
const Contesttrade = model('Contesttrade', ContesttradeSchema);

module.exports = Contesttrade;
