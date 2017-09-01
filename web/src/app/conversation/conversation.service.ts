import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {HttpClient, HttpHeaders} from "@angular/common/http";

import * as io from 'socket.io-client';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { ServerService } from '../utils/server.service';
import { AuthService } from '../auth/auth.service';

import { Message } from './message';
import { Conversation } from './conversation'

@Injectable()
export class ConversationService {
  private apiUrl = this.serverService.getServerUrl();
  private socket;
  private socketConnection: {status: boolean, socketId: string};
  public acknowledge;

  constructor(
    private serverService: ServerService,
    private authService: AuthService,
    private httpClient: HttpClient
   ) {
     this.socketConnection = {status: false, socketId: null}
   }

  getConnected(){
    this.socket = io(this.apiUrl);
    this.socket.on('connect', function(){
      this.socket.emit('joinserver', this.authService.loggedInUserInfo.user);
      this.socketConnection.status = true;
    }.bind(this));

    this.socket.on('disconnect', function(){
      this.socketConnection.status = false;
      this.socketConnection.socketId = null;
    }.bind(this));

    this.socket.on('socketid', function(data){
      this.socketConnection.socketId = data;
    }.bind(this));
  }

  getDisconnected(){
    this.socket.disconnect();
  }

  getConnectionStatus(): Boolean {
    return this.socketConnection.status;
  }

  getSocketId(): string {
    return this.socketConnection.socketId;
  }

  getConversations(): Observable<any[]>{
   let conversationsApiUrl = '/conversations';
   return this.httpClient
     .get(conversationsApiUrl)
  }

  createNewConversation(conversationsModeratorMessage): Observable<any>{
    return new Observable((observer: any) => {
      this.socket.emit('conversationsmoderator', conversationsModeratorMessage, function(ack){
        console.log(ack)
        observer.next(ack);
      })
    })
  }

  getMessages(conversationId): Observable<any[]>{
    let messagesApiUrl = '/conversations/messages/' + conversationId;
    return this.httpClient
      .get(messagesApiUrl)
  }

  getConversationsModeratorObservable(): Observable<Conversation[]> {
   return new Observable((observer: any) => {
     this.socket.on('conversationsmoderator', (data) => {
       console.log(data)
       observer.next(data);
     });
   });
  }

  getMessagesObservable(): Observable<Message[]> {
    return new Observable((observer: any) => {
      this.socket.on('message', (data) => {
        console.log(data)
        //data = JSON.parse(data);
        var comingMessage = new Message();
        comingMessage.conversationId = data['conversationId'];
        comingMessage.message = data['message'];
        comingMessage.messageType = data['messageType'];
        comingMessage.senderId = data['senderId'];
        comingMessage.url = data['url'];
        observer.next(comingMessage);
      });
    });
  }

  sendMessage(newMessage){
    this.socket.emit('message', newMessage, function(ack){
      console.log(ack)
    })
  }

  joinConversation(conversationId){
    this.socket.emit('joinconversation', conversationId)
  }

  leaveConversation(conversationId){
    this.socket.emit('leaveconversation', conversationId)
  }

  findConversationByContactId(contactId): Observable<any[]>{
    var findConversationByContactIdApiUrl = '/conversations/findby/' + contactId;
    return this.httpClient
      .get(findConversationByContactIdApiUrl)
  }

  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  clearMessages(conversationId): Observable<any[]>{
    var messagesApiUrl = '/conversations/messages/' + conversationId;
    return this.httpClient
      .delete(messagesApiUrl, {headers: this.headers})
  }

  deleteConversation(conversationId) {
    var deleteConversationApiUrl = '/conversations/delete/' + conversationId;
    return this.httpClient
      .delete(deleteConversationApiUrl)
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
