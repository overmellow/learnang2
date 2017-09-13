var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('MyConversation', new Schema({
	conversation: { type: Schema.Types.ObjectId, ref: 'Conversation'},
  seen: { type: String, default: 'sent' }
}));
