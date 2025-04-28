/* const { sequelize, DataTypes } = require('../config/database');

const UserModel = sequelize.define('user', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.STRING
  },
  zip: {
    type: DataTypes.INTEGER
  },
  location: {
    type: DataTypes.STRING
  }
});

module.exports = UserModel; */

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
