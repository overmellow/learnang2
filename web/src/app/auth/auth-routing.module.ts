import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 
import { AuthenticationComponent } from './authentication.component';
import { SignupComponent } from './signup.component';
 
const authRoutes: Routes = [
  { path: 'authentication', component: AuthenticationComponent},
  { path: 'signup', component: SignupComponent},
];
 
@NgModule({
  imports: [
    RouterModule.forChild(authRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule { }
