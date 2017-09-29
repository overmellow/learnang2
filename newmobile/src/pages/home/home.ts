import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ProfilePage } from '../profile/profile';
import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    public authProvider: AuthProvider
  ) {
  }

  gotoProfile(){
    this.navCtrl.setRoot(ProfilePage);
  }
}
