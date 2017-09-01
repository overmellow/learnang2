import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

import * as $ from 'jquery';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { NewConversationService } from './new-conversation.service';
import { Conversation } from './conversation';
import { Contact } from './contact'

@Component({
  selector: 'new-conversation',
  templateUrl: './new-conversation.component.html',
  providers: [NewConversationService]
})
export class NewConversationComponent implements OnInit {
  contacts: Observable<Contact[]>;
  private searchNames = new Subject<string>();

  @Output() onSelectedContact = new EventEmitter<Contact>();

  constructor(
    private newConversationService: NewConversationService,
    private router: Router) {}

  // Push a search term into the observable stream.
  search(name: string): void {
    this.searchNames.next(name);
  }

  ngOnInit(): void {
    this.contacts = this.searchNames
      .debounceTime(300)        // wait 300ms after each keystroke before considering the term
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(name => name   // switch to new observable each time the term changes
        // return the http search observable
        ? this.newConversationService.search(name)
        // or the observable of empty heroes if there was no search term
        : Observable.of<Contact[]>([]))
      .catch(error => {
        // TODO: add real error handling
        console.log(error);
        return Observable.of<Contact[]>([]);
      });
  }

  openConversation(contact: Contact): void {
    this.onSelectedContact.emit(contact)
  }
}
