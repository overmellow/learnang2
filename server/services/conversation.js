var Conversation = require('../models/conversation')
var User = require('../models/user');

var SocketsService = require('./sockets')

module.exports = (function(){
  return {
    createConversation: function(senderId, contactId){
      var newConversation = new Conversation({conversationPartners: [senderId, contactId]});
      newConversation.messages = []
      return newConversation.save(function(err, conversation){
        if(err) res.send(err)
        var newMyConversation = {conversation: conversation._id, conversationId: conversation._id}

        User.findById(senderId, function(err, user){
          if(err) res.send(err)

          user.myConversations.push(newMyConversation);
          user.save()
        })

        User.findById(contactId, function(err, contact){
          if(err) res.send(err)

          contact.myConversations.push(newMyConversation);
          contact.save();
        })
      });
    },
    // createMyConversation: function(userId, conversation){
    //   var newMyConversation = {conversation: conversation._id, conversationId: conversation._id}
    //
    //   User.findById(userId, function(err, user){
    //     if(err) res.send(err)
    //
    //     user.myConversations.push(newMyConversation);
    //     user.save()
    //   })
    // },
    saveMessage: function(conversation, message){
      conversation.messages.push(message);
      return conversation.save();
    }
  }
})();
