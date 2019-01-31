const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	email: { type: String, require: true, unique: true },
	password: { type: String, require: true },
	role: String
});

const User = mongoose.model('users', UserSchema); 
module.exports = User;