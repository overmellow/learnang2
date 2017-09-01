import { Component, Input } from '@angular/core';

import { Notification } from './notification'

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html'
})
export class NotificationComponent {
  @Input() notification: Notification;

  constructor() { }
}
