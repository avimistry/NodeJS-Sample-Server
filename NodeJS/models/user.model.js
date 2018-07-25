'use strict';

var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt-nodejs'),
    Schema   = mongoose.Schema;

var UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
      type: String,
      unique: true,
      required: true,
      match: [/.+\@.+\..+/, 'Please enter a valid email']
  },
  password: String,
  contactNo:Number,
  isDeleted: {
    type: Boolean,
    default: false
  },
  resetPassword: {
    type: Boolean,
    default: false
  },
  createdDate: {
        type: Date,
        default: Date.now
  },
  updatedDate: {
        type: Date,
        default: Date.now
  }
});

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
