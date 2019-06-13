var config = require('../config/config.json');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var storeList = require('../models/storelist.js').storelist;
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var Account = require('../models/user.js');
module.exports = function(app){

	// passport/login.js
	passport.use(Account.createStrategy());

	passport.serializeUser(Account.serializeUser());

	passport.deserializeUser(function(id, done){
		Account.findOne({ username: id }, function(err, user){
					var query = {};
					if (!user.admin){
						query = { id: { $in : user.stores } }
					}
					storeList.find(query, function(err,docs){
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
							var usr = user.toObject();
							usr['stores'] = stores;
							done(err, usr);
						}
					});

	  });
	});

	app.use(cookieParser());
	app.use(bodyParser.json());		// to support JSON-encoded bodies
	app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

	app.use(session({ secret: 'yoloswag', saveUninitialized: true, resave: true }));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());

	app.get('/login', function(req, res, next) {
		if (req.user){
			var backURL = req.headers.referer || '/';
			return res.redirect(backURL);
		}
		res.render('login', { title: "Login", version: config.version});
	});
	app.post('/login', function(req, res, next) {
		passport.authenticate('local', function(err, user, info) {
			if (err) { return next(err) }
			if (!user) {
				// *** Display message without using flash option
				// re-render the login form with a message
				return res.render('login', { title: "Login", version: config.version, message: info});
			}
			req.logIn(user, function (err) {
				if (err) { return next(err); }
			});
			if (user.admin)
				req.session['selectedStore']  = 1;
			else
				req.session['selectedStore']  = user.stores[0];
			res.redirect(req.session.returnTo || '/');
    	delete req.session.returnTo;
		})(req, res, next);
	});

	app.get('/logout', function(req, res, next) {
		req.logout();
		res.redirect('/');
	});

	app.post('/register', function(req, res, next) {
		console.log('registering user');
		Account.register(new Account({username: req.body.username, email:req.body.email}), req.body.password, function(err) {
			if (err) {
				console.log('error while user register!', err);
				return next(err);
			}

			console.log('user registered!');

			res.redirect('/');
		});
});
};
