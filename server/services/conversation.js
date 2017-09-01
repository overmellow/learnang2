var Conversation = require('../models/conversation')
var User = require('../models/user');

module.exports = (function(){
  return {
    createConversation : function(senderId, contactId){
      var newConversation = new Conversation({conversationPartners: [senderId, contactId]});
      newConversation.messages = []
      return newConversation.save(function(err, conversation){
        if(err) res.send(err)

        User.findById(senderId, function(err, user){
          if(err) res.send(err)

          user.conversations.push(conversation)
          user.save()
        })

        User.findById(contactId, function(err, contact){
          if(err) res.send(err)

          contact.conversations.push(conversation)
          contact.save();
        })
      });
    },
    saveMessage: function(conversation, message){
      conversation.messages.push(message);
      return conversation.save(function(err){
         if (err) throw err;
      });
    }
  }
})();
