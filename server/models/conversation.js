var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Conversation', new Schema({
	conversationPartners: [{
		type: Schema.Types.ObjectId, ref: 'User'
	}],
	date: { type: Date, default: Date.now },
	updated_at: { type: Date },
	messages: [{
		type: Schema.Types.ObjectId, ref: 'Message'
	}]
})
.pre('save', function(next){
  this.updated_at = new Date();
  next();
}));
