var config = require('../config/config.json');
var errorRoutes = require('../routes/ErrorRoutes.js');
var userModel = require('../models/user.js');
var storeList = require('../models/storelist.js').storelist;
var moment = require('moment');
var async = require("async");

module.exports = function(app){
	/* GET home page. */
	app.get('/newUser', function(req, res) {
		var param = {};
		param.title = "New User";
		param.version = config.version;
		if (req.user && req.user.admin){
			param.user = req.user;
			param.selectedStore = req.session.selectedStore;
			return res.render('newUser', param);
		}
		else if (req.user) {
			errorRoutes.FileNotFound(req, res);
		}else{
      req.session.returnTo = req.path;
			return res.render('login');
		}
	});

	app.post('/newUser', function(req, res, next) {
		if (req.user && req.user.admin){
			userModel.register(new userModel({
				username: req.body.username,
				email: req.body.email,
				admin: req.body.admin,
				stores: req.body.stores
			}), req.body.password, function(err) {
				var param = {};
				param.user = req.user;
				param.title = "Success! - New User";
				param.version = config.version;
				param.selectedStore = req.session.selectedStore;
				if (err){
					console.log('error while user register!', err);
					param.error = true;
					return res.render('newUser', param);
				} else{
					param.sname = req.body.username;
					return res.render('newUser', param);
				}
			});
		}
		else if (req.user) {
			errorRoutes.FileNotFound(req, res);
		}else{
	    req.session.returnTo = req.path;
			return res.render('login');
		}
	});

	app.get('/getUsers', function(req, res) {
		if (req.user && req.user.admin){
			if (req.query.username){
				userModel.findByUsername(req.query.username, function(err,docs){
					if (err){
						console.error("Error Occured!", err);
						result.error = true;
						return res.render('editStore', result);
					} else{
						return res.json(docs);
					}
				});
			}else{
				userModel.find({}, function(err,docs){
					if (err){
						console.error("Error Occured!", err);
						param.error = true;
						res.render('newStore', param);
					} else {
						var users = [];
						docs.forEach(function(usr){
							var ur = {};
							ur.id = usr.username;
							users.push(ur);
						});
						return res.json(users);
					}
				});
			}
		}else if (req.user) {
			errorRoutes.FileNotFound(req, res);
		}
		else {
			req.session.returnTo = req.path;
			res.render('login');
		}
	});

	app.get('/editUser', function(req, res) {
		var param = {};
		param.title = "Edit User";
		param.version = config.version;
		if (req.user && req.user.admin){
			param.user = req.user;
			param.selectedStore = req.session.selectedStore;
			return res.render('editUser', param);
		}else if (req.user) {
			errorRoutes.FileNotFound(req, res);
		}else{
      req.session.returnTo = req.path;
			return res.render('login');
		}
	});

	app.post('/editUser', function(req, res, next) {
		if (req.user && req.user.admin){
			userModel.findOneAndUpdate({
														username: req.body.username,
													},
													{
														email: req.body.email,
														admin: req.body.admin,
														stores: req.body.stores || null
													},
			{ safe: true, new: true, upsert: true }, function(err, obj) {
				if (!req.body.password || 0 < req.body.password.length){
					userModel.findByUsername(req.body.username, function(err, obj) {
						if (obj){
							obj.setPassword(req.body.password, function(){
								obj.save();
							});
						}
					});
				}
				var param = {};
				param.user = req.user;
				param.title = "Success! - Edit Store";
				param.version = config.version;
				param.selectedStore = req.session.selectedStore;
				if (err){
					console.error("Error Occured!", err);
					param.error = true;
				} else{
					param.sname = req.body.storeDesc;
				}
				return res.render('editUser', param);
		});
		}else if (req.user) {
			errorRoutes.FileNotFound(req, res);
		}else{
	    req.session.returnTo = req.path;
			return res.render('login');
		}
	});
}
