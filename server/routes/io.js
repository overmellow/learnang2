var app = require('express');
var router = app.Router();
var SocketsService = require('../services/sockets')
var ConversationService = require('../services/conversation')

var User = require('../models/user')
var Conversation = require('../models/conversation');
var Message = require('../models/message');

var _ = require('underscore');

module.exports = function(io) {
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

    socket.on('joinconversation', function(conversationId){
      socket.join(conversationId)
    })

    socket.on('leaveconversation', function(conversationId){
      socket.leave(conversationId)
    })

    // socket.on('conversationsmoderator', function(data){
    //   if(data['conversationType'] == 'newConversation'){
    //     ConversationService.createMyConversation(data['senderId'], data['receiverId'])
    //       .then(function(conversation){
    //         socket.emit('conversationsmoderator', {conversationType: 'newConversation', newConversationType: 'creater', tempConversationId: data['tempConversationId'], conversationId: conversation._id})
    //         socket.join(conversation._id)
    //
    //         Conversation.findById(conversation._id)
    //         .populate('conversationPartners').exec()
    //         .then(function(newconversation){
    //           let receiverSocketId = SocketsService.findReceiverSocketIdByConversationPartnerId(data['receiverId'])
    //           socket.to(receiverSocketId).emit('conversationsmoderator', {conversationType: 'newConversation', newConversationType: 'receiver', conversation: newconversation})
    //         })
    //       })
    //   }
    // })

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

      newMessage.save()

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
                SocketsService.socketSendMessage(socket, receiverSocketId, 'conversationsmoderator', {conversationType: 'newConversation', newConversationType: 'receiver', conversation: newConversation})
                //socket.to(receiverSocketId).emit('conversationsmoderator', {conversationType: 'newConversation', newConversationType: 'receiver', conversation: newConversation})
                
                ConversationService.saveMessage(conversation, newMessage)
                  .then(function(conversation){
                    data['conversationId'] = createdConversationId;
                    io.in(createdConversationId).emit('message', data);
                    SocketsService.sendMessageUnconnectedUsersSockets(io, socket, conversation.conversationPartners, createdConversationId, senderId, data)
                  })
              })
          })
      } else {
        Conversation.findById(conversationId, function(err, conversation){
          ConversationService.saveMessage(conversation, newMessage)
          .then(function(conversation){
            io.in(data.conversationId).emit('message', data);
            SocketsService.sendMessageUnconnectedUsersSockets(io, socket, conversation.conversationPartners, conversationId, senderId, data)
         })
       })
     }
    });
  });

  return router;
}
