import { Injectable } from '@angular/core';

@Injectable()
export class LocalstorageService {
  constructor() { }

  setData(key, val, stringify) : void{
    if(stringify){
      val = JSON.stringify(val);
    }

    window.localStorage && window.localStorage.setItem(key, val)
    return;
  }

  getData(key, stringify){
    if(stringify){
      return JSON.parse(window.localStorage && window.localStorage.getItem(key))
    }

    return window.localStorage && window.localStorage.getItem(key);
  }

  removeData(key){
    return window.localStorage && window.localStorage.removeItem(key);
  }
}
