import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

import { AuthService } from './auth.service';
import { NotificationService } from '../notification/notification.service'

@Component({
  templateUrl: './signup.component.html'
})
export class SignupComponent {
  constructor(
    public authService: AuthService,
    public router: Router,
    private notificationService: NotificationService
  ) {
  }

  signup(name: string, email: string, password: string): void {
    name = name.trim();
    email = email.trim();

    if (!name || !email || !password ) {
     this.notificationService.addNotification('You have to provide name, emaill and password!', 'danger', 3);
     return;
    }
    
    let that = this
    this.authService.signup(name, email, password).then(res => {
      that.notificationService.addNotification('You`ve signed up sucessfully!', 'success', 3);
      if (this.authService.isLoggedIn) {
        let redirect = '/auth/login';
        // Redirect the user
        this.router.navigate([redirect]);
      }
    })
  }
}
