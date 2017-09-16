import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Conversation } from './conversation';
import { Contact } from './contact';
import { MyConversation } from './my-conversation';

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
  myConversations: MyConversation[] = [];
  selectedMyConversation = null;

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
    this.conversationService.getConversations().subscribe(res => this.myConversations = res);
  }

  // createNewConversation(){
  //   let newConversationModeratorMessage = {
  //     conversationType: 'newConversation',
  //     tempConversationId: this.selectedConversation._id ,
  //     senderId: this.authService.loggedInUserInfo.user.id,
  //     receiverId: this.selectedConversation.conversationPartners[0]._id
  //   }

  //   this.conversationService.createNewConversation(newConversationModeratorMessage)
  //     .subscribe(res => console.log(res));
  // }

  getConversationsModerator(): void {
    var that = this
    this.conversationService.getConversationsModeratorObservable()
      .subscribe(data => {
        console.log(data)
        if(data['conversationType'] == 'newConversation'){
          if(data['newConversationType'] == 'creater') {
            this.selectedMyConversation.conversation._id = data['conversationId'];
            this.selectedMyConversation.conversation.conversationType = 'existingConversation';
            this.myConversations.push(this.selectedMyConversation)
          }
          else if (data['newConversationType'] == 'receiver') {
            var newConversation = new Conversation();
            newConversation = data['conversation'];
            newConversation['actualmessages'] = []
            let myNewConversation = new MyConversation();
            myNewConversation.conversation = newConversation;
            this.myConversations.push(myNewConversation)
          }
        }
      })
  }

  getMessages(): void {
    this.conversationService.getMessagesObservable()
      .subscribe(message => {
        console.log(message)
        let conversationIndex = _.findIndex(_.pluck(this.myConversations, 'conversation'), { _id : message['conversationId'] });
        if(this.selectedMyConversation == this.myConversations[conversationIndex]){
          this.selectedMyConversation.actualmessages.push(message);
        } else {
          if(this.myConversations[conversationIndex].newMessageNotification == undefined){
            this.myConversations[conversationIndex].newMessageNotification = 1;   
          } else {
            this.myConversations[conversationIndex].newMessageNotification++;
          }
          this.myConversations[conversationIndex].actualNewMessageNotification = message['message'];
        }
        console.log(this.myConversations)
      })
  }

  sendMessage(msg){
    if (!msg ) { return; }

    var newMessage = {
      conversationId: this.selectedMyConversation.conversation._id,
      conversationType: this.selectedMyConversation.conversation.conversationType ? this.selectedMyConversation.conversation.conversationType : 'existingConversation',
      message: msg,
      messageType: 'text',
      senderId: this.authService.loggedInUserInfo.user.id,
      receiverId: this.selectedMyConversation.conversation.conversationPartners[0]._id,
      url: '',
    }
    //this.selectedMyConversation.conversation.actualmessages.push(newMessage)

    this.conversationService.sendMessage(newMessage);
  }

  joinConversation(conversationId){
    this.conversationService.joinConversation(conversationId)
  }

  onMySelect(myConversation){
    this.selectedMyConversation = myConversation;   
    this.selectedMyConversation.newMessageNotification = undefined;
    this.selectedMyConversation.actualNewMessageNotification = undefined;
    this.joinConversation(myConversation.conversation._id);
    this.conversationService.getMessages(myConversation.conversation._id)
      .subscribe(messages => {this.selectedMyConversation.actualmessages = messages})
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
          let myTempConversation = new MyConversation();
          myTempConversation.conversation = tempConversation;
          this.selectedMyConversation = myTempConversation;
        } else {        
          let theIndexOfConversation = _.findIndex(_.pluck(that.myConversations, 'conversation'), { _id: conversation[0]._id });
          that.onMySelect(that.myConversations[theIndexOfConversation])
        }
      })
  }

  clearMessages(conversationId){
    this.conversationService.clearMessages(conversationId).subscribe(() => {
     this.selectedMyConversation.conversation.actualmessages = [];
    });
  }

  deleteConversation(conversationId){
    this.conversationService.deleteConversation(conversationId).subscribe(() => {
     this.selectedMyConversation = null;
     let conversationIndex = _.findIndex(_.pluck(this.myConversations, 'conversation'), {_id: conversationId});
     this.myConversations.splice(conversationIndex, 1);
    });
  }
}
