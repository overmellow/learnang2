import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

@Injectable()
export class StorageProvider {

  constructor(public storage: Storage) {
    console.log('Hello StorageProvider Provider');
  }

  setData(key, val) : void{
    this.storage.set(key, val);
    return;
  }

  getData(key){
    return this.storage.get(key);
  }

  removeData(key){
    return this.storage.remove(key);
  }

}
