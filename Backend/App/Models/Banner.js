"use strict";

const { Schema, model } = require('mongoose');

const BannerSchema = new Schema({
   
    image: {
        type: String,
        trim: true,
        default: null
    },
    hyperlink: {
        type: String,
        trim: true,
        default: null
    },
    status: {
        type: Boolean,
        default: true // assuming true means active and false means inactive
    },
    add_by: {
        type: String,
        trim: true,
        default: null
    },
    type: {
        type: String,
        trim: true,
        default: null
    },
    offer_status: {
        type: Number, // changed to Number
        enum: [1, 0],
        default: 0
    },
    del: {
        type: Boolean,
        default: false // assuming false means not deleted
    },
    start: {
        type: Date,
        default: null
    },
    end: {
        type: Date,
        default: null
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Define the model
const Banner = model('Banner', BannerSchema);

module.exports = Banner;
