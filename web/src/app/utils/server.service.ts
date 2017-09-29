import { Injectable } from '@angular/core';

@Injectable()
export class ServerService {
  private serverUrl = 'http://ec2-13-57-36-138.us-west-1.compute.amazonaws.com';
  //private serverUrl = 'http://172.17.0.1';
  private serverPort = '4300';

  constructor(){}
  
  getServerUrl(){
    return this.serverUrl + ':' + this.serverPort;
  }
}
