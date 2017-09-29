import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { StorageProvider } from '../../providers/storage/storage';

import { ConversationProvider } from './../../providers/conversation/conversation';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  apiUrl;
  constructor(public navCtrl: NavController, public storageProvider: StorageProvider) {
    this.storageProvider.getData('apiUrl').then(res => this.apiUrl = res);
  }

  saveApiUrl(){
    this.storageProvider.setData('apiUrl', this.apiUrl);
  }
}
