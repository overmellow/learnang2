import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

import { AuthService } from './auth.service';
import { NotificationService } from '../notification/notification.service'

@Component({
  templateUrl: './authentication.component.html'
})
export class AuthenticationComponent {
  constructor(
    public authService: AuthService,
    public router: Router,
    private notificationService: NotificationService
  ) {}

  login(name: string, password: string): void {
    name = name.trim();
    if (!name) {
      this.notificationService.addNotification('No name provided', 'danger', null);
      return;
    }

    let that = this

    this.authService.login(name, password).then(res => {
      if (this.authService.isLoggedIn) {
        // Get the redirect URL from our auth service
        // If no redirect has been set, use the default
        let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/conversations';

        let navigationExtras: NavigationExtras = {
          preserveQueryParams: true,
          preserveFragment: true
        };

        // Redirect the user
        this.router.navigate([redirect], navigationExtras);
      }
    }).catch(function(err){
      that.notificationService.addNotification('Authentication failed!', 'danger', 3);
    })
  }

  logout() {
    this.authService.logout();
  }
}
