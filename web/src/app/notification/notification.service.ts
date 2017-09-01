import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

import { Notification } from './notification'

@Injectable()
export class NotificationService {
  private subject = new Subject<any>();

  constructor() { }

  addNotification(content, color, timer) {
    this.subject.next(new Notification(content, color));
    if(timer){
      let that = this
      setTimeout(function(){
        that.clearNotification()
      }, timer * 1000)
    }
  }

  clearNotification() {
      this.subject.next();
  }

  getNotification(): Observable<any> {
      return this.subject.asObservable();
  }
}
