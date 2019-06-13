var mongoose = require('mongoose');
var StoreListSchema = new mongoose.Schema({
	id: Number,
  description: String,
  openingdate: { type: Date, default: Date.now },
  openingregister: String
});

var storelist = mongoose.model('storelist', StoreListSchema);

module.exports = {
	storelist: storelist
}
