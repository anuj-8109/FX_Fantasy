"use strict";

const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const CitySchema = new Schema({
  _id: ObjectId,
  city: { type: String, required: true },
  state: { type: String, required: true }  // here, store state name or state id as you wish
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = model('City', CitySchema);
