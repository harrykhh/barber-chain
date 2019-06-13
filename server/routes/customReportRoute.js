var config = require('../config/config.json');
var errorRoutes = require('../routes/ErrorRoutes.js');
var storeLog = require('../models/storesummary.js');
var storeList = require('../models/storelist.js').storelist;
var async = require("async");
var moment = require('moment');

module.exports = function(app){
	/* GET home page. */
	app.get('/customReport/:id', function(req, res) {
		var param = {};
		if (req.user){
			var bool = function(stores, param){
				for(var i=0; i< stores.length; i++){
					if (stores[i].id == param)
						return false;
				}
				return true;
			}
			if (bool(req.user.stores, req.params.id)){
				errorRoutes.FileNotFound(req, res);
				return;
			}
			var param = {};
			param.title = "New Custom Report";
			param.version = config.version;
			param.selectedStore = req.params.id;
			for(var i=0; i< req.user.stores.length; i++){
				if (req.user.stores[i].id == parseInt(req.params.id)){
					param.selectedStoreName = req.user.stores[i].desc;
				}
			}
			param.user = req.user;
			async.parallel({
				max: function(callback) {
					storeLog.findOne({
						storeid: req.params.id
					}).sort({date:-1}).exec(function(err, obj) {
						if (!obj || err){
							console.error("Error Occured!", err);
							param.error = true;
							param.errorMessage = "There are no summary found, please create a new daily summary and try again";
						}else{
							param.enddate = moment.utc(obj.date).format('MM-DD-YYYY');
						}
						callback(null, null);
					});
				},
				min: function(callback) {
					storeLog.findOne({
						storeid: req.params.id
					}).sort({date:+1}).exec(function(err, obj) {
						if (!obj || err){
							console.error("Error Occured!", err);
							param.error = true;
							param.errorMessage = "There are no summary found, please create a new daily summary and try again";
						}else{
							param.startdate = moment.utc(obj.date).format('MM-DD-YYYY');
						}
						callback(null, null);
					});
				}
			}, function(err, results) {
				return res.render('customReport', param);
			});
		}else{
			req.session.returnTo = req.path;
			return res.redirect('/login');
		}
	});

	app.get('/getReportData', function(req, res) {
		if (req.user){
			var bool = function(stores, param){
				for(var i=0; i< stores.length; i++){
					if (stores[i].id == param)
						return false;
				}
				return true;
			}
			if (bool(req.user.stores, req.query.storeid)){
				errorRoutes.FileNotFound(req, res);
				return;
			}
			var di = moment(req.query.startdate, 'MM-DD-YYYY').toArray();
			var de = moment(req.query.enddate, 'MM-DD-YYYY').toArray();
			storeLog.find({
				storeid: req.query.storeid,
				date: {
					$gte: moment.utc(req.query.startdate),
					$lte: moment.utc(req.query.enddate)
				}
			}).sort('date').exec(function(err, obj) {
				if (err){
					console.error("Error Occured!", err);
					req.session['submiterror'] = true;
					req.session['user'] = req.user;
					return res.redirect('/customReport/' + req.params.id);
				}
				return res.json(obj);
			});
		}else{
			req.session.returnTo = req.path;
			return res.redirect('/login');
		}
	});

}
