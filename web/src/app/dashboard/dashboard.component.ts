import { Component, OnInit} from '@angular/core';

import { LocalstorageService } from '../utils/localstorage.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  constructor(private localstorageService: LocalstorageService) { }

  ngOnInit() {}

  
}
