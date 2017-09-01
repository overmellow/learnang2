import { Component, Input } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { AuthService } from './auth/auth.service';
import { ConversationService } from './conversation/conversation.service';
import { LocalstorageService } from './utils/localstorage.service'
import { NotificationService } from './notification/notification.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'LearnAng2';
  notification: any;
  subscription: Subscription;

  constructor(
    public authService: AuthService,
    public conversationService: ConversationService,
    public localstorageService: LocalstorageService,
    private notificationService: NotificationService
  ){}

  ngOnInit(): void {
    this.subscription = this.notificationService.getNotification().subscribe(notification => { this.notification = notification; });

    let authenticationStatus = this.localstorageService.getData('authenticationStatus', false)
    let authenticatedUser = this.localstorageService.getData('authenticatedUser', true)
    let token = this.localstorageService.getData('token', false)
    if(authenticationStatus){
        this.authService.setAuthenticationStatus(authenticationStatus)
    }
    if(authenticatedUser){
      this.authService.setAuthenticatedUser(authenticatedUser)
    }
    if(token){
      this.authService.setToken(token)
    }
  }
}
