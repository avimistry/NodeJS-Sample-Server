'use strict';

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var AuthSchema = new Schema({
  token: String,
  iss: {
      type: String,
      unique: true,
      required: true
  },
  accessDateTime:  {
        type: Date,
        default: Date.now
  },
});

module.exports = mongoose.model('AuthUser', AuthSchema);
