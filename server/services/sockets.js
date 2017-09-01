var Conversation = require('../models/conversation')
var User = require('../models/user');

var _ = require('underscore');

module.exports = (function(){
  var mySockets = [];
  var connectedUsersSockets = {}

  return {
    addSocket: function(socket){
      mySockets.push(socket)
    },
    removeSocket: function(socket){
      mySockets.splice(mySockets.indexOf(socket), 1);
    },
    addToConncetedUsersSockets: function(socketId, loggedInUserInfo){
      connectedUsersSockets[socketId] = loggedInUserInfo;
    },
    removeFromConncetedUsersSockets: function(socketId){
      delete connectedUsersSockets[socketId];
    },
    findRoomSockets: function(roomsockets) {
      var availableSockets = [];
      var sockets = roomsockets;
      if (sockets) {
        for (var socket in sockets) {
            availableSockets.push(socket);
        }
      }
      return availableSockets;
    },
    findReceiverSocketIdByConversationPartnerId: function(conversationPartnerId){
      for(socketId in connectedUsersSockets){
        if(connectedUsersSockets[socketId].id == conversationPartnerId){
          return socketId;
        }
      }
      return false;
    },
    sendMessageUnconnectedUsersSockets: function(io, socket, conversationPartners, conversationId, senderId, data){
      let roomSockets = this.findRoomSockets(io.sockets.adapter.rooms[conversationId].sockets)
      let receiverId = _.reject(conversationPartners, function(conversationPartnerId){return conversationPartnerId == senderId})
      let receiverSocketId = this.findReceiverSocketIdByConversationPartnerId(receiverId[0]);
      if(!_.contains(roomSockets, receiverSocketId)){
         socket.to(receiverSocketId).emit('message', data)
      }
    }
  }
})();
