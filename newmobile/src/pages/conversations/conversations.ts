import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';

import { ConversationProvider } from './../../providers/conversation/conversation';
import { StorageProvider } from '../../providers/storage/storage';

@IonicPage()
@Component({
  selector: 'page-conversations',
  templateUrl: 'conversations.html',
})
export class ConversationsPage {
  //conversations: Observable<any>;
  conversations;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public conversationProvider: ConversationProvider, 
    public storageProvider: StorageProvider
  ){
    this.conversationProvider.getConversations()
      .subscribe(res => {this.conversations = res; console.log(res);})
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConversationsPage');
  }

  onMySelect(myConversation) {
    this.navCtrl.push('ConversationPage', {conversationId: myConversation.conversationId});
  }
 
  goToPlanets() {
    this.navCtrl.parent.select(2);
  }

}
