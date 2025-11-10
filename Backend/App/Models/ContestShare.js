"use strict";

const { Schema, model } = require('mongoose');

const ContestShareSchema = new Schema({
   
     contest_id: {
         type: Schema.Types.ObjectId,
            ref: "Contest",
            required: true
         },
     shared_with_client_id: { 
    type: Schema.Types.ObjectId,
    ref: "CLIENTS",
    required: true
   },
  shared_by_client_id: {
     type: Schema.Types.ObjectId,
    ref: "CLIENTS",
    required: true
   },
    status: {
        type: Boolean,
        default: true // assuming true means active and false means inactive
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
    del: {
        type: Boolean,
        default: false // assuming false means not deleted
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Define the model
const ContestShare = model('ContestShare', ContestShareSchema);

module.exports = ContestShare;
