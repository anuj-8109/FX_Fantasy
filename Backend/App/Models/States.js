"use strict";

const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { ObjectId } = mongoose.Schema.Types;
const StateSchema = new Schema({
  _id: ObjectId, // your custom ObjectId as string
  code: { type: String, required: true },
  id: { type: Number, required: true },
  name: { type: String, required: true }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = model('State', StateSchema);
