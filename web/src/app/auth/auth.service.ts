import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { ServerService } from '../utils/server.service'
import { LocalstorageService } from '../utils/localstorage.service'

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService {
  private apiUrl = this.serverService.getServerUrl();
  isLoggedIn = false;
  loggedInUserInfo = null;

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  constructor(
    private http: Http,
    private serverService: ServerService,
    public localstorageService: LocalstorageService
  ) { }

  logout(): void {

    this.setAuthenticationStatus(false)

    this.setAuthenticatedUser(null);
    this.localstorageService.removeData('authenticationStatus')
    this.localstorageService.removeData('authenticatedUser')
    this.localstorageService.removeData('token')
  }

  private headers = new Headers({'Content-Type': 'application/json'});

  login(name: string, password: string): Promise<boolean> {
    const url = `${this.apiUrl}/auth/signin`;
    return this.http
      .post(url, JSON.stringify({name: name, password: password}), {headers: this.headers})
      .toPromise()
      .then(res => {
        if (res) {
         this.setAuthenticationStatus(true); var response = res.json();
         this.localstorageService.setData('authenticationStatus', true, false)

         this.setAuthenticatedUser(response.user)
         this.localstorageService.setData('authenticatedUser', response.user, true)

         this.setToken(response.token)
         this.localstorageService.setData('token', response.token, false)
        } else { this.setAuthenticationStatus(false) }
      })
      .catch(this.handleError);
  }

  signup(name: string, email: string, password: string): Promise<boolean> {
    const url = `${this.apiUrl}/auth/signup`;
    return this.http
      .post(url, JSON.stringify({name: name, email: email, password: password}), {headers: this.headers})
      .toPromise()
      .then(res => {
        if (res) {}
        else {this.isLoggedIn = false}
      })
      .catch(this.handleError);
  }

  setAuthenticationStatus(status){
    this.isLoggedIn = status;
  }

  getAuthenticationStatus(){
    return this.isLoggedIn;
  }

  setAuthenticatedUser(authenticatedUser){
    if(authenticatedUser === null) {
      this.loggedInUserInfo = null;
      return;
    }

    this.loggedInUserInfo = {user: null, token: ''};
    this.loggedInUserInfo.user = authenticatedUser;
  }

  getAuthenticatedUser(){
    return this.loggedInUserInfo.user;
  }

  setToken(token){
    this.loggedInUserInfo.token = token;
  }

  getToken(){
    return this.loggedInUserInfo.token;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
