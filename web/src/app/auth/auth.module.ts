import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }    from '@angular/forms';

import { AuthenticationComponent } from './authentication.component';
import { SignupComponent } from './signup.component';

import { AuthService } from './auth.service';
import { LocalstorageService } from '../utils/localstorage.service';

import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AuthRoutingModule
  ],
  declarations: [
    AuthenticationComponent,
    SignupComponent
  ],
  providers: [ AuthService, LocalstorageService ]
})
export class AuthModule { }
