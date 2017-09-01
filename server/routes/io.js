module.exports = function(io) {
    var app = require('express');
    var router = app.Router();
    var SocketsService = require('../services/sockets')
    var ConversationService = require('../services/conversation')

    var User = require('../models/user')
    var Conversation = require('../models/conversation');
    var Message = require('../models/message');

    var _ = require('underscore');

    io.on('connection', function (socket) {
      console.log('a user connected with socket ID: ' + socket.id);
      socket.emit('socketid', socket.id);
      SocketsService.addSocket(socket)

      socket.on('joinserver', function(loggedInUserInfo){
        SocketsService.addToConncetedUsersSockets(socket.id, loggedInUserInfo)
      })

      socket.on('disconnect', function () {
        SocketsService.removeFromConncetedUsersSockets(socket.id);
        SocketsService.removeSocket(socket)
      });

      socket.on('conversationsmoderator', function(data){
        if(data['conversationType'] == 'newConversation'){
          ConversationService.createConversation(data['senderId'], data['receiverId'])
            .then(function(conversation){
              socket.emit('conversationsmoderator', {conversationType: 'newConversation', newConversationType: 'creater', tempConversationId: data['tempConversationId'], conversationId: conversation._id})
              socket.join(conversation._id)

              Conversation.findById(conversation._id)
              .populate('conversationPartners').exec()
              .then(function(newconversation){
                let receiverSocketId = SocketsService.findReceiverSocketIdByConversationPartnerId(data['receiverId'])
                socket.to(receiverSocketId).emit('conversationsmoderator', {conversationType: 'newConversation', newConversationType: 'receiver', conversation: newconversation})
              })
            })
        }
      })

      socket.on('message', function (data, callback) {
        //console.log(data);
        //console.log(socket.id)
        let tempConversationId = data.conversationId;
        let conversationId = data.conversationId;
        let createdConversationId;
        let contactId = data.receiverId;
        let senderId = data.senderId;
        let conversationType = data.conversationType;
        var newMessage = new Message({'message': data.message, messageType: data.messageType, senderId: data.senderId, url: data.url});
        newMessage.save(function(err, message){
          if (err) return handleError(err)
        })

        if(conversationType == 'newConversation'){
          ConversationService.createConversation(senderId, contactId)
            .then(function(conversation){
              createdConversationId = conversation._id;
              socket.emit('conversationsmoderator', {conversationType: 'newConversation', newConversationType: 'creater', tempConversationId: tempConversationId, conversationId: createdConversationId})
              socket.join(createdConversationId)

              Conversation.findById(createdConversationId)
              .populate('conversationPartners').exec()
                .then(function(newConversation){
                  let receiverSocketId = SocketsService.findReceiverSocketIdByConversationPartnerId(contactId)
                  socket.to(receiverSocketId).emit('conversationsmoderator', {conversationType: 'newConversation', newConversationType: 'receiver', conversation: newConversation})
                  socket.to(createdConversationId).emit('test', 'test: findConversation');
                })

              ConversationService.saveMessage(conversation, newMessage)
                .then(function(conversation){
                  data['conversationId'] = createdConversationId;
                  socket.in(createdConversationId).emit('message', data);
                  socket.in(createdConversationId).emit('test', 'test: saveMessage');
                  SocketsService.sendMessageUnconnectedUsersSockets(io, socket, conversation.conversationPartners, conversationId, senderId, data)
                })
            })
        } else {
          Conversation.findById(conversationId, function(err, conversation){
            ConversationService.saveMessage(conversation, newMessage)
            .then(function(conversation){
              socket.in(data.conversationId).emit('message', data);
              socket.to(data.conversationId).emit('test', 'test: existingConversation');
              SocketsService.sendMessageUnconnectedUsersSockets(io, socket, conversation.conversationPartners, conversationId, senderId, data)
           })
         })
       }
      });

      socket.on('joinconversation', function(conversationId){
        socket.join(conversationId)
      })

      socket.on('leaveconversation', function(conversationId){
        socket.leave(conversationId)
      })
    });

    return router;
}
