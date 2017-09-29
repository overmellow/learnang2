import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ConversationsPage } from '../conversations/conversations';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ConversationsPage;
  tab3Root = AboutPage;

  constructor() {

  }
}
