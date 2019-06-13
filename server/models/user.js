var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	passportLocalMongoose = require('passport-local-mongoose');

var user = new Schema({
		username: String,
		password: String,
		email: String,
  	admin: { type: Boolean, default: false },
		stores: [Number]
	});

user.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', user);
