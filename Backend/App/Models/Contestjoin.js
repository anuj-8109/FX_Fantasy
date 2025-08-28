"use strict";

const { Schema, model } = require("mongoose");

const ContestJoinSchema = new Schema({
  contest_id: {
    type: Schema.Types.ObjectId,
    ref: "Contest",
    required: true
  },
  client_id: {
    type: Schema.Types.ObjectId,
    ref: "CLIENTS",
    required: true
  },
  entry_count: {
    type: Number,
    default: 1,
    min: 1
  },
  price: {
    type: Number,
    default: 1,
    min: 0
  },
  discount: {
    type: Number,
    default: 1,
    min: 0
  },
  total: {
    type: Number,
    default: 1,
    min: 0
  },
   points: {
    type: Number,
    default: 0 // calculate later
  },
  rank: {
    type: Number,
    default: 0 // assign when contest ends
  },
  joined_at: {
    type: Date,
    default: Date.now
  }
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

module.exports = model("ContestJoin", ContestJoinSchema);
