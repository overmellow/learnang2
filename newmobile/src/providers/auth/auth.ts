import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { ServerProvider } from '../server/server';
import { StorageProvider } from '../storage/storage';

@Injectable()
export class AuthProvider {
  private apiUrl = this.serverProvider.getServerUrl();
  isLoggedIn = false;
  loggedInUserInfo = null;

  constructor(
    public http: Http,
    public serverProvider: ServerProvider,
    public storageProvider: StorageProvider
  ) {
    console.log('Hello AuthProvider Provider');
  }

  logout(): void {
    console.log('logged out');    
    this.setAuthenticationStatus(false)

    this.setAuthenticatedUser(null);
    this.storageProvider.removeData('authenticationStatus')
    this.storageProvider.removeData('authenticatedUser')
    this.storageProvider.removeData('token')
  }

  private headers = new Headers({'Content-Type': 'application/json'});

  login(name: string, password: string): Promise<boolean> {
    const url = `${this.apiUrl}/auth/signin`;
    return this.http
      .post(url, JSON.stringify({name: name, password: password}), {headers: this.headers})
      .toPromise()
      .then(res => {
        if (res) { console.log('loggedin');

         this.setAuthenticationStatus(true); var response = res.json();
         this.storageProvider.setData('authenticationStatus', true)

         this.setAuthenticatedUser(response.user)
         this.storageProvider.setData('authenticatedUser', response.user)

         this.setToken(response.token)
         this.storageProvider.setData('token', response.token)
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
