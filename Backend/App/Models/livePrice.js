"use strict";

const { Schema, model } = require('mongoose');

const LivePriceSchema = new Schema({
   
    ticker: { type: String, required: true, unique: true },
    date: { type: String },
    bidSize: { type: Number, default: 0 },
    bidPrice: { type: Number, default: 0 },
    midPrice: { type: Number, default: 0 },
    askPrice: { type: Number, default: 0 },
    askSize: { type: Number, default: 0 },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Define the model
const LivePrice = model('LivePrice', LivePriceSchema);

module.exports = LivePrice;
