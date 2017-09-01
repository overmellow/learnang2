var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
  name: String,
  password: String,
  email: String,
  conversations: [{
    type: Schema.Types.ObjectId, ref: 'Conversation'
  }],
}));
