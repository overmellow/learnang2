var express = require('express');
var router = express.Router();

var _ = require('underscore');

var User = require('../models/user');
var Conversation = require('../models/conversation')
var Message = require('../models/message');

var ConversationService = require('../services/conversation')

router
.get('/messages/:conversationid', function(req, res, next) {
  Conversation.findById(req.params.conversationid)
  .populate('messages')
  .exec()
  .then(function(conversation) {
    res.json(conversation.messages);
  })
})

.delete('/messages/:conversationid', function(req, res, next) {
  Conversation.findById(req.params.conversationid, function(err, conversation){
    Message.remove({_id: { $in: conversation.messages}}).exec();
    conversation.messages = [];
    conversation.save(function(err){
       res.json({success: true});
    })
  })
})

.get('/findby/:contactid', function(req, res, next) {
  Conversation.find()
  .where('conversationPartners').equals(req.params.contactid)
  .exec()
  .then(function(conversation) {
    res.json(conversation);
  })
})

.delete('/delete/:conversationid', function(req, res, next) {
  Conversation.findById(req.params.conversationid, function(err, conversation){
    //console.log(conversation)
    conversation.conversationPartners.forEach(function(conversationPartnerId){
      User.findById(conversationPartnerId, function(err, user) {
        let index = user.conversations.indexOf(req.params.conversationid)
        user.conversations.splice(index, 1)
        user.save();
      })
    })
    Message.remove({_id: { $in: conversation.messages}}).exec();
    conversation.remove(function(err){
      res.json({success: true});
    })
  })
})

.post('/create/:userId/:contactId', function(req, res, next){
   var userId = req.params.userId
   var contactId = req.params.contactId

   ConversationService.createConversation(userId, contactId).then(function(conversation){
     res.json(conversation)
   });
  })

 .get('/details/:conversationId', function(req, res) {
   Conversation.findById(req.params.conversationId)
   .populate('conversationPartners messages')
   //.select('date updated_at conversationPartners')
//   .populate({
   // 	populate: {
   // 		path: 'conversationPartners',
   // 		model: 'User',
   // 		select: 'name email'}
   // 	})
   .exec()
   .then(function(conversation){
    //  user.conversations.forEach(function(conversation){
    //    conversation.conversationPartners = _.without(conversation.conversationPartners, _.findWhere(conversation.conversationPartners, {
    //      id: req.decoded._id
    //    }));
    //  })
     res.json(conversation);
   })
 })

.get('/', function(req, res) {
  User.findById(req.decoded._id)
  .populate({
  	path: 'conversations',
  	populate: {
  		path: 'conversationPartners',
  		model: 'User',
  		select: 'name email'}
  	})
  .exec()
  .then(function(user){
    user.conversations.forEach(function(conversation){
      conversation.conversationPartners = _.without(conversation.conversationPartners, _.findWhere(conversation.conversationPartners, {
        id: req.decoded._id
      }));
    })
    res.json(user.conversations);
  })
})

module.exports = router;
