var express = require('express');
var path = require('path');
var app = express();
var port = process.env.PORT || 3000;
// view engine setup
app.set('views', path.join(__dirname, '/server/views'));
app.set('view engine', 'pug');
app.locals.pretty = true // indent produces HTML for clarity

app.use(express.static(path.join(__dirname + '/server/public')));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

require('./server/routes/route.js')(app);

var server = app.listen(port, function() {
	console.log('Listening on port ' + port);
});

