const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String
    },
    address: {
      type: String
    },
    zip: {
      type: Number
    },
    location: {
      type: String
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model('User', UserSchema);
