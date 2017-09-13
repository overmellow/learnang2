var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var myConversation = new Schema({
	conversationId: String,
	conversation: { type: Schema.Types.ObjectId, ref: 'Conversation'},
  seen: { type: String, default: 'sent' }
})

module.exports = mongoose.model('User', new Schema({
  name: String,
  password: String,
  email: String,
  // conversations: [{
  //   type: Schema.Types.ObjectId, ref: 'Conversation'
  // }],
  // myConversations: [{
  //   type: Schema.Types.ObjectId, ref: 'MyConversation'
  // }],
  myConversations: [ myConversation ],
}));
