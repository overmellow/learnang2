import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../auth/auth-guard.service';

import { ConversationsComponent } from './coversations.component';

const conversationRoutes: Routes = [
  { path: 'conversations',  component: ConversationsComponent, canActivate: [AuthGuard] },
];
 
@NgModule({
  imports: [
    RouterModule.forChild(conversationRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ConversationRoutingModule { }
