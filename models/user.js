// Load required packages
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var { specialCharRegex, emailRegex } = require('../constants/regex')
// Define our user schema

var userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required:  [true, 'First Name required'],
    minlength:  [3, 'First Name required minimum 3 character'],
    maxlength:  [15, 'First Name allowed only maximum 15 character'],
    validate: [validateSpecialChar, 'First Name Special Characters not allowed']
  },
  lastName: {
    type: String,
    required:  [true, 'Last Name required'],
    maxlength:  [15, 'Last Name allowed only maximum 15 character'],
    validate: [validateSpecialChar, 'Last Name Special Characters not allowed']

  },
  email: {
      type: String,
      unique:true,
      required: [true, 'Email required'],
      validate: [validateEmail, 'Invalid Email']

  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

function validateSpecialChar (value) {

  if(! specialCharRegex.test(value))
    return false
  return true
}
function validateEmail(value) {
  if (! emailRegex.test(value))
    return false
  return true
}

userSchema.plugin(uniqueValidator, { message: '{PATH} already exists' });


// Execute before each user.save() call
userSchema.pre('save', function(callback) {
  var user = this;

  // Break out if the password hasn't changed
  if (!user.isModified('password')) return callback();

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return callback(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return callback(err);
      user.password = hash;
      callback();
    });
  });
});// Execute before each user.save() call

userSchema.methods.verifyPassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};


userSchema.plugin(mongoosePaginate);

// Export the Mongoose model
module.exports = mongoose.model('User', userSchema);
