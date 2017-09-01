import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Conversation } from './conversation';
import { Contact } from './contact';

@Injectable()
export class NewConversationService {

  constructor(
    private httpClient: HttpClient
  ) {}

  search(name: string): Observable<Contact[]> {
    var searchContactsApiUrl = '/users/find/' + name;
    return this.httpClient
       .get(searchContactsApiUrl)
  }
}
