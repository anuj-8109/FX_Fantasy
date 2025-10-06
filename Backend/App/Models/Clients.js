"use strict"
const crypto = require('crypto');
const { Schema, model } = require('mongoose');

const clientsModel = new Schema({
    FullName: {
        type: String,
        trim: true,
        default: null
    },
    Email: {
        type: String,
        trim: true,
        default: null
    },
    PhoneNo: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /\d{10}/.test(v); // ensures exactly 10 digits
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        default: null
    },
    password: {
        type: String,
        trim: true,
        default: null
    },
    panno: {
        type: String,
        trim: true,
        default: null
    },
    aadhaarno: {
        type: String,
        trim: true,
        default: null
    },
    kyc_verification: {
        type: Number, // changed to Number
        enum: [1, 0, 2],
        default: 0
    },
    pdf: {
        type: String,
        trim: true,
        default: null
    },
    add_by: {
        type: String,
        trim: true,
        default: null
    },
    wamount: {
        type: Number,
        default: 0,
        min: 0
    },
     referwamount: {
        type: Number,
        default: 0,
        min: 0
    },
    del: {
        type: Number, 
        enum: [1, 0],
        default: 0
    },
    ActiveStatus: {
        type: Number, 
        enum: [1, 0],
        default: 0
    },
    refer_status: {
        type: Number, // changed to Number
        enum: [1, 0],
        default: 0
    },
    refer_token: {
        type: String,
        default: null
    },
    state: {
        type: String,
        trim: true,
        default: null
    },
    city: {
        type: String,
        trim: true,
        default: null
    },
     dob: {
        type: String,
        trim: true,
        default: null
    },
     image: {
        type: String,
        trim: true,
        default: null
    },
   kyc_type: {
        type: Number, // changed to Number
        enum: [1, 0],
        default: 0
    },
   adhaarphotofront: {
        type: String,
        trim: true,
        default: null
    },
    adhaarphotoback: {
        type: String,
        trim: true,
        default: null
    },
    pancard: {
        type: String,
        trim: true,
        default: null
    },
     token: {
        type: String,
        trim: true,
        default: null
    },
}, {
    timestamps: true
});

const Clients_model = model('CLIENTS', clientsModel);



module.exports = Clients_model;
