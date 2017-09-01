var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Message', new Schema({
	senderId: String,
	messageType: String,
	message: String,
	url: String,
	date: { type: Date, default: Date.now }
}));
