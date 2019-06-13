var config = require('../config/config.json');
var errorRoutes = require('../routes/ErrorRoutes.js');
var userModel = require('../models/user.js').user;
var log = require('../models/storesummary.js').ssummary;
var async = require("async");

module.exports = function(app){
	/* GET home page. */
	app.get('/', function(req, res) {
		console.log(req.user);
		var param = {};
		param.title = "Barber Chain";
		param.version = config.version;
		if (req.user){
			param.selectedStore = req.session.selectedStore;
			param.user = req.user;
			res.render('index', param);
		}else{
			req.session.returnTo = req.path;
			res.render('login', param);
		}
	});
}
