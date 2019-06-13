require('../config/mongo.js');
var errorRoutes = require('../routes/ErrorRoutes.js');
module.exports = function(app){
	require('../routes/authRoute.js')(app);
	require('../routes/indexRoute.js')(app);
	require('../routes/storesRoute.js')(app);
	require('../routes/usersRoute.js')(app);
	require('../routes/profileRoute.js')(app);
	require('../routes/reportRoute.js')(app);
	require('../routes/customReportRoute.js')(app);
	require('../routes/editReportRoute.js')(app);
	require('../routes/ErrorRoutes.js').Errors(app);
}
