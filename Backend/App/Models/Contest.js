"use strict";

const { Schema, model } = require("mongoose");

const ContestSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: null
  },
  contest_type: {
    type: String,
    enum: ["Mega", "Head-to-Head", "Private"],
    required: true
  },
  entry_fee: {
    type: Number,
    required: true,
    min: 0
  },
  total_spots: {
    type: Number,
    required: true,
    min: 2
  },
  filled_spots: {
    type: Number,
    default: 0
  },
  max_entry_per_user: {
    type: Number,
    default: 1
  },
  prize_pool: {
    type: Number,
    required: true,
    min: 0
  },
  prize_distribution: [
    {
      rank: { type: Number, required: true },
      amount: { type: Number, required: true }
    }
  ],
  is_guaranteed: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ["upcoming", "live", "completed", "cancelled"],
    default: "upcoming"
  },
  stocks: [
    {
      stock_name: { type: String, required: true }
    }
  ],
  is_private: {
    type: Boolean,
    default: false
  },
  contest_code: {
    type: String,
    default: null
  },
  startdate: {
        type: Date,
        required: true
    },
  enddate: {
        type: Date,
        required: true
    },
  add_by: {
        type: String,
        trim: true,
        default: null
    },
  activestatus: {
        type: Boolean,
        default: true // assuming true means active and false means inactive
    },
  del: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Contest = model("Contest", ContestSchema);

module.exports = Contest;
