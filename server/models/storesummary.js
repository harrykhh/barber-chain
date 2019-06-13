var mongoose = require('mongoose');
// Define Log model
var SummarySchema = new mongoose.Schema({
	storeid: { type:Number, index:true },
	date : { type: Date, default: Date.now, index:true },
	opening: String,
	closing: String,
	grossRegister: String,
	netSales: String,
	serviceSales: { total: Number,
			transaction: [{
							amount: Number,
							desc: String
						}]
			},
	retailSales: { total: Number,
			transaction: [{
							amount: Number,
							desc: String
						}]
			},
	adjustmentGrossSales: { total: Number,
			transaction: [{
							amount: Number,
							desc: String
						}]
			},
	expense: { total: Number,
			transaction: [{
							amount: Number,
							desc: String
						}]
			},
	certificates : {
						aafes: Number,
						gift: Number,
						total: Number
					},
	deposit:{
				cash: Number,
				creditcard: Number,
				dpp: Number,
				leftover: Number,
				total: Number
			}
});

module.exports = mongoose.model('storesummary', SummarySchema);
