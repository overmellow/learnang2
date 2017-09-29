import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

import { AboutPage } from '../pages/about/about';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen'

import { ConversationProvider } from '../providers/conversation/conversation';
import { StorageProvider } from '../providers/storage/storage';
import { ServerProvider } from '../providers/server/server';
import { AuthProvider } from '../providers/auth/auth';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorProvider } from '../providers/auth-interceptor/auth-interceptor';

import { ConversationsPageModule } from '../pages/conversations/conversations.module'
import { ProfilePageModule } from '../pages/profile/profile.module';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    ConversationsPageModule,
    ProfilePageModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ConversationProvider,
    StorageProvider,
    ServerProvider,
    AuthProvider,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorProvider,
      multi: true,
    },
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
