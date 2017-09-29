import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  authType: string = "login";
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public authProvider: AuthProvider
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  login(name: string, password: string){
    name = name.trim();
    if (!name) {
      //this.notificationService.addNotification('No name provided', 'danger', null);
      return;
    }

    let that = this

    this.authProvider.login(name, password).then(res => {
      if (this.authProvider.getAuthenticationStatus()) {
        this.navCtrl.setRoot(TabsPage); 
        // Get the redirect URL from our auth service
        // If no redirect has been set, use the default
        //let redirect = this.authProvider.redirectUrl ? this.authProvider.redirectUrl : '/conversations';

        // let navigationExtras: NavigationExtras = {
        //   preserveQueryParams: true,
        //   preserveFragment: true
        // };

        // // Redirect the user
        // this.router.navigate([redirect], navigationExtras);
      }
    }).catch(function(err){
      //that.notificationService.addNotification('Authentication failed!', 'danger', 3);
    })
  }

  logout() {
    if(this.authProvider.logout()){
      //this.navCtrl.setRoot()
      this.navCtrl.setRoot(ProfilePage);
    };
  }
}
