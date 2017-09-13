var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Message = require('../models/message');

module.exports = mongoose.model('MyMessage', new Schema({
	senderId: String,
  status: {type: String, default: 'sent'},
	message: { type: Schema.Types.ObjectId, ref: 'Message'},
}));
