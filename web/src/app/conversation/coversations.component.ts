import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Conversation } from './conversation';
import { Contact } from './contact';

import { ConversationService } from './conversation.service';
import { AuthService } from '../auth/auth.service';
import { LocalstorageService } from '../utils/localstorage.service'

import { NotificationService } from '../notification/notification.service'

import * as _ from 'underscore';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html'
})

export class ConversationsComponent implements OnInit, OnDestroy {
  //connection;
  //socketId: string;
  //currentMessages = [];
  //connectionStatus: Boolean = false;
  conversations: Conversation[] = [];
  selectedConversation = null;

  constructor(
    private conversationService: ConversationService,
    private authService: AuthService,
    private localstorageService: LocalstorageService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(){
    this.connect();
    this.getConversations();
    this.getMessages();
    this.getConversationsModerator();
  }

  ngOnDestroy(){
    this.disconnect();
    //this.connection.unsubscribe();
  }

  disconnect(): void {
    this.conversationService.getDisconnected();
  }

  connect(): void {
    this.conversationService.getConnected()
  }

  getConversations(): void {
    this.conversationService.getConversations().subscribe(res => this.conversations = res);
  }

  createNewConversation(){
    let newConversationModeratorMessage = {
      conversationType: 'newConversation',
      tempConversationId: this.selectedConversation._id ,
      senderId: this.authService.loggedInUserInfo.user.id,
      receiverId: this.selectedConversation.conversationPartners[0]._id
    }

    this.conversationService.createNewConversation(newConversationModeratorMessage)
      .subscribe(res => console.log(res));
  }

  getConversationsModerator(): void {
    var that = this
    this.conversationService.getConversationsModeratorObservable()
      .subscribe(data => {
        console.log(data)
        if(data['conversationType'] == 'newConversation'){
          if(data['newConversationType'] == 'creater') {
            this.selectedConversation._id = data['conversationId'];
            this.selectedConversation.conversationType = 'existingConversation';
            this.conversations.push(this.selectedConversation)
          }
          else if (data['newConversationType'] == 'receiver') {
            var newConversation = new Conversation();
            newConversation = data['conversation'];
            newConversation['actualmessages'] = []
            this.conversations.push(newConversation)
          }
        }
      })
  }

  getMessages(): void {
    this.conversationService.getMessagesObservable()
      .subscribe(message => {
        console.log(message)
        let conversationIndex = _.findIndex(this.conversations, {_id: message['conversationId']});
        if(this.selectedConversation == this.conversations[conversationIndex]){
          this.selectedConversation.actualmessages.push(message);
        } else {
            console.log(this.conversations[conversationIndex])
          if(this.conversations[conversationIndex]['newMessageNotification'] == undefined){
            this.conversations[conversationIndex]['newMessageNotification'] = 1;
          } else {
            this.conversations[conversationIndex]['newMessageNotification']++;
          }
        }
      })
  }

  sendMessage(msg){
    if (!msg ) { return; }

    var newMessage = {
      conversationId: this.selectedConversation._id,
      conversationType: this.selectedConversation.conversationType ? this.selectedConversation.conversationType : 'existingConversation',
      message: msg,
      messageType: 'text',
      senderId: this.authService.loggedInUserInfo.user.id,
      receiverId: this.selectedConversation.conversationPartners[0]._id,
      url: '',
    }
    this.selectedConversation.actualmessages.push(newMessage)

    this.conversationService.sendMessage(newMessage);
  }

  joinConversation(conversationId){
    this.conversationService.joinConversation(conversationId)
  }

  onSelect(conversation){
    this.selectedConversation = conversation;
    this.selectedConversation.newMessageNotification = undefined;
    this.joinConversation(conversation._id);
    this.conversationService.getMessages(conversation._id)
      .subscribe(messages => this.selectedConversation.actualmessages = messages)
  }

  onSelectedContact(contact: Contact){
    var that = this;
    this.conversationService.findConversationByContactId(contact._id)
      .subscribe(conversation => {
        if(_.isEmpty(conversation)){
          let tempConversation = new Conversation();
          tempConversation._id = Math.random().toString(36);
          tempConversation.conversationType = 'newConversation';
          tempConversation['conversationPartners'] = [];
          tempConversation['conversationPartners'].push({_id: contact._id, name: contact.name})
          tempConversation['actualmessages'] = [];
          this.selectedConversation = tempConversation;
        } else {
          let theIndexOfConversation = _.findIndex(that.conversations, { _id: conversation[0]._id });
          that.onSelect(that.conversations[theIndexOfConversation])
        }
      })
  }

  clearMessages(conversationId){
    this.conversationService.clearMessages(conversationId).subscribe(() => {
     this.selectedConversation.actualmessages = [];
    });
  }

  deleteConversation(conversationId){
    this.conversationService.deleteConversation(conversationId).subscribe(() => {
     this.selectedConversation = null;
     let conversationIndex = _.findIndex(this.conversations, {_id: conversationId});
     this.conversations.splice(conversationIndex, 1);

    });
  }
}
