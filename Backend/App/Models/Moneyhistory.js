"use strict";

const { Schema, model } = require('mongoose');

const MoneyhistorySchema = new Schema({
    client_id: {
        type: Schema.Types.ObjectId,
        ref: 'CLIENTS', // Assuming there's a 'Client' model to reference
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'expired'], // Example statuses
        default: 'active'
    },
    orderid: {
        type: String,
        default: null
    },
    ordernumber: {
        type: String,
        default: null
    },
    invoice: {
        type: String,
        default: null
    },
    del: {
        type: Boolean,
        default: false // Indicates whether the subscription is marked as deleted
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Define the model
const Moneyhistory = model('Moneyhistory', MoneyhistorySchema);

module.exports = Moneyhistory;
