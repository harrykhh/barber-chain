var config = require('../config/config.json');
var errorRoutes = require('../routes/ErrorRoutes.js');
var storeLog = require('../models/storesummary.js');
var storeList = require('../models/storelist.js').storelist;
var async = require("async");
var moment = require('moment');

module.exports = function(app){
	/* GET home page. */
	app.get('/newReport/:id', function(req, res) {
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
			storeLog.findOne({
				storeid: req.params.id
			}).sort('-date').exec(function(err, obj) {
				var param = {};
				if (err){
					console.error("Error Occured!", err);
					req.session['submiterror'] = true;
					req.session['user'] = req.user;
					return res.redirect('/newReport/' + req.params.id);
				}
				param.title = "New Report";
				param.version = config.version;
				param.selectedStore = req.params.id;
				for(var i=0; i< req.user.stores.length; i++){
					if (req.user.stores[i].id == parseInt(req.params.id)){
						param.selectedStoreName = req.user.stores[i].desc;
					}
				}
				param.user = req.user;
				if (obj) {
					param.lastReportDate = moment.utc(obj.date).add(1, 'days').format('MM-DD-YYYY');
					param.lastOpening = obj.closing;
					return res.render('report', param);
				} else {
					storeList.findOne({ id: req.params.id }).exec(function(err, obj){
						var result = {};
						result = obj;
						if (err){
							console.error("Error Occured!", err);
							param.error = true;
							return res.render('editStore', param);
						} else{
							if (obj){
								param.lastReportDate = moment.utc(obj.openingdate).format('MM-DD-YYYY');
								param.lastOpening = result.openingregister;
								return res.render('report', param);
							}
								errorRoutes.FileNotFound(req, res);
						}
					});
				}
			});

		}else{
			req.session.returnTo = req.path;
			return res.redirect('/login');
		}
	});

	app.post('/newReport/:id', function(req, res, next) {
					var ssales = [];
					for (var i = 0; i <  req.body.ServiceSales.length; i++) {
						var sales = {};
						sales.desc = req.body.ServiceSales[i];
						sales.amount = req.body.ssalesamount[i];
						if (sales.amount != 0 && sales.desc.length !=0)
							ssales.push(sales);
					}
					var rsales = [];
					for (var i = 0; i <  req.body.RetailSales.length; i++) {
						var sales = {};
						sales.desc = req.body.RetailSales[i];
						sales.amount = req.body.rsalesamount[i];
						if (sales.amount != 0 && sales.desc.length !=0)
							rsales.push(sales);
					}
					var agsales = [];
					for (var i = 0; i <  req.body.AdjustmentGrossSales.length; i++) {
						var sales = {};
						sales.desc = req.body.AdjustmentGrossSales[i];
						sales.amount = req.body.agsalesamount[i];
						if (sales.amount != 0 && sales.desc.length !=0)
							agsales.push(sales);
					}
					var expense = [];
					for (var i = 0; i <  req.body.expenses.length; i++) {
						var sales = {};
						sales.desc = req.body.expenses[i];
						sales.amount = req.body.expenseamount[i];
						if (sales.amount != 0 && sales.desc.length !=0)
							expense.push(sales);
					}
					storeLog.findOneAndUpdate({
                                date: moment.utc(req.body.date),
																storeid: req.params.id
                              },
                              {
																date: moment.utc(req.body.date),
																opening: req.body.opening,
															 	closing: req.body.closing,
																grossRegister: req.body.grossregister,
																serviceSales: {
																	total: req.body.grossservicesales,
																	transaction: ssales
																},
																retailSales: {
																	total: req.body.grossretailsales,
																	transaction: rsales
																},
																adjustmentGrossSales: {
																	total: req.body.grossadjustmentretailsales,
																	transaction: agsales
																},
																netSales: req.body.netsales,
																expense: {
																	total: req.body.grossexpense,
																	transaction: expense
																},
																certificates : {
																					aafes: req.body.AAFES,
																					gift: req.body.Certificates,
																					total: req.body.grosscertificates
																},
																deposit:{
																			cash: req.body.cashAchecks,
																			creditcard: req.body.ccards,
																			dpp: req.body.dpp,
																			leftover: req.body.cashleftover,
																			total: req.body.totaldeposit
																}
															},
          { safe: true, new: true, upsert: true }, function(err, obj) {
						var param = {};
            if (err){
							//console.error("Error Occured!", err);
							req.session['submiterror'] = true;
							req.session['user'] = req.user;
							return res.redirect('/newReport/' + req.params.id);
						}
						return res.redirect('/customReport/' + req.params.id);
          });
	});
}
