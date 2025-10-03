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
