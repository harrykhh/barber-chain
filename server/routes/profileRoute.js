var config = require('../config/config.json');
var errorRoutes = require('../routes/ErrorRoutes.js');
var userModel = require('../models/user.js');

module.exports = function(app){
	/* GET profile. */
	app.get('/profile', isLoggedIn, function(req, res) {
		var param = {};
		param.title = req.user.username + "'s Profile";
		param.user = req.user;
		param.version = config.version;
		param.selectedStore = req.session.selectedStore;
		res.render('profile', param);
	});

	/* POST profile. */
	app.post('/profile', isLoggedIn, function(req, res) {
		if (req.user){
			userModel.findOneAndUpdate({
														username: req.user.username,
													},
													{
														email: req.body.email
													},
			{ safe: true, new: true, upsert: true }, function(err, obj) {
				if (!req.body.password || 0 < req.body.password.length){
					userModel.findByUsername(req.user.username, function(err, obj) {
						if (obj){
							obj.setPassword(req.body.password, function(){
								obj.save();
							});
						}
					});
				}
				var param = {};
				param.user = req.user;
				param.title = "Success! - Update Profile";
				param.version = config.version;
				param.selectedStore = req.session.selectedStore;
				if (err){
					console.error("Error Occured!", err);
					param.error = true;
				}else{
					param.saved = true;
				}
				return res.render('profile', param);
			});
		}
	});
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the Login in Page
	return res.render('login', { title: "Login", version: config.version, message: "You need to be logged in to perform the following function." });
}
