const mongoose = require("mongoose");

// Define the schema
const entrySchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 100,
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 15,
    match: /^[0-9]+$/,
  },
  address: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 200,
  },
  organization: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 100,
  },
  category: {
    type: String,
    required: true,
    enum: ["Private", "Government"],
    trim: true,
    minlength: 1,
    maxlength: 50,
  },
  city: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 50,
  },
  state: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the model
const Entry = mongoose.model("Entry", entrySchema);

module.exports = Entry;
