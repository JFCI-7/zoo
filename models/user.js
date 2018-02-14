'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
  name : String,
  surname : String,
  email : String,
  password : String,
  image: String,
  role : String
});

UserSchema.methods.speak = function(){
  var greeting = this.name ? "Mi nombre es: " + this.name : "No tengo nombre";
  console.log(greeting);
};

module.exports = mongoose.model('User', UserSchema);
