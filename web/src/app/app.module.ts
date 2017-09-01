import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';

import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component'
import { AuthModule } from './auth/auth.module';
import { ConversationModule } from './conversation/coversation.module';

import { NotificationComponent } from './notification/notification.component'

import { AuthGuard } from './auth/auth-guard.service';
import { ServerService } from './utils/server.service';
import { NotificationService } from './notification/notification.service'

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './utils/authinterceptor'

import { AppRoutingModule } from './app-routing/app-routing.module';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    ConversationModule,
    AuthModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    NotificationComponent
  ],
  providers: [
    AuthGuard,
    ServerService,
    NotificationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
