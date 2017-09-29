import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ConversationProvider } from './../../providers/conversation/conversation';

@IonicPage()
@Component({
  selector: 'page-conversation',
  templateUrl: 'conversation.html',
})
export class ConversationPage {
  conversationId;
  actualmessages;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public conversationProvider: ConversationProvider 
  ){
    this.conversationId = this.navParams.get('conversationId');

    this.conversationProvider.getMessages(this.conversationId)
      .subscribe(messages => {this.actualmessages = messages})
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConversationPage');
  }
  

}
