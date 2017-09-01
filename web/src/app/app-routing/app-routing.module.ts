import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from '../dashboard/dashboard.component';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from '../auth/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/conversations', pathMatch: 'full' },
  //{ path: 'conversations', loadChildren: '../conversation/conversation.module#ConversationModule' },
  { path: 'dashboard', component: DashboardComponent , canActivate: [AuthGuard] },
  //{ path: 'users', loadChildren: '../users/users.module#UsersModule', canLoad: [AuthGuard] },
  { path: '**', redirectTo: '/conversations' },
  //{ path: '**', component: NotFoundComponent },
];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
