import { Injectable } from '@angular/core';

@Injectable()
export class ServerProvider {  
  private serverUrl = 'http://ec2-13-57-36-138.us-west-1.compute.amazonaws.com';
  private serverPort = '4300';

  constructor() {
    console.log('Hello ServerProvider Provider');
  }

  getServerUrl(){
    return this.serverUrl + ':' + this.serverPort;
  }

}

