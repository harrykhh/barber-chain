var config = require('../config/config.json');
var errorRoutes = require('../routes/ErrorRoutes.js');
var storeList = require('../models/storelist.js').storelist;
var moment = require('moment');
var async = require("async");

module.exports = function(app){
	/* GET home page. */
	app.get('/newStore', function(req, res) {
		var param = {};
		param.title = "New Store";
		param.version = config.version;
		if (req.user && req.user.admin){
			param.user = req.user;
			param.selectedStore = req.session.selectedStore;
			return res.render('newStore', param);
		}
		else if (req.user) {
			errorRoutes.FileNotFound(req, res);
		}else{
      req.session.returnTo = req.path;
			return res.render('login');
		}
	});
	app.post('/newStore', function(req, res, next) {
					storeList.findOne().sort('-id').exec(function (err, member){
						var id = 1;
						if (member){
							id = member.id + 1;
						}
						storeList.findOneAndUpdate({
																	description: req.body.storeDesc,
																},
																{
																	id: id,
																	description: req.body.storeDesc,
																	openingdate: moment.utc(req.body.date),
																	openingregister: req.body.openingRegister
																},
						{ safe: true, new: true, upsert: true }, function(err, obj) {
							var param = {};
							param.user = req.user;
							param.title = "Success! - New Store";
							param.version = config.version;
							param.selectedStore = req.session.selectedStore;
							if (err){
								console.error("Error Occured!", err);
								param.error = true;
								return res.render('newStore', param);
							} else{
								param.sname = req.body.storeDesc;
								return res.render('newStore', param);
							}
						});
					});
	});

	app.get('/getStores', function(req, res) {
		if (req.user && req.user.admin){
			if (req.query.id){
				storeList.findOne({ id: req.query.id}, function(err,docs){
					var result = {};
					if (err){
						console.error("Error Occured!", err);
						result.error = true;
						return res.render('editStore', result);
					} else{
						if (docs){
							result.openingdate = moment.utc(docs.openingdate).format('MM-DD-YYYY');
							result.openingregister = docs.openingregister;
							result.description = docs.description;
						}
						return res.json(result);
					}
				});
			}else{
				storeList.find({}, function(err,docs){
					if (err){
						console.error("Error Occured!", err);
						param.error = true;
						res.render('newStore', param);
					} else {
						var stores = [];
						docs.forEach(function(stor){
							var st = {};
							st.id = stor.id;
							st.desc = stor.description;
							stores.push(st);
						});
						return res.json(stores);
					}
				});
			}
		}else if (req.user) {
			errorRoutes.FileNotFound(req, res);
		}else{
			req.session.returnTo = req.path;
			res.render('login');
		}
	});

	app.get('/editStore', function(req, res) {
		var param = {};
		param.title = "Edit Store";
		param.version = config.version;
		if (req.user){
			param.selectedStore = req.session.selectedStore;
			param.user = req.user;
			return res.render('editStore', param);
		}else{
      req.session.returnTo = req.path;
			return res.render('login');
		}
	});
	app.post('/editStore', function(req, res, next) {
		storeList.findOneAndUpdate({
													id: req.body.storeid,
												},
												{
													id: req.body.storeid,
													description: req.body.storeDesc,
													openingdate: moment.utc(req.body.date),
													openingregister: req.body.openingRegister
												},
		{ safe: true, new: true, upsert: true }, function(err, obj) {
			var param = {};
			param.user = req.user;
			param.selectedStore = req.session.selectedStore;
			param.title = "Success! - Edit Store";
			param.version = config.version;
			if (err){
				console.error("Error Occured!", err);
				param.error = true;
			} else{
				param.sname = req.body.storeDesc;
			}
			return res.render('editStore', param);
		});
	});

	app.get('/setStore/:id', function(req, res, next) {
		if (req.user){
			req.session['selectedStore'] = req.params.id;
			var backURL = req.headers.referer || '/';
			return res.redirect(backURL);
		}
		res.render('login', { title: "Login", version: config.version});
	});
}
