"use strict";

const { Schema, model } = require("mongoose");

const TournamentSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
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
  add_by: {
    type: String,
    trim: true,
    default: null
  },
  activestatus: {
    type: Boolean,
    default: true // true = active, false = inactive
  },
  del: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});


TournamentSchema.index({ startdate: 1 });
TournamentSchema.index({ enddate: 1 });
TournamentSchema.index({ activestatus: 1, del: 1 });

const Tournament = model("Tournament", TournamentSchema);

module.exports = Tournament;
