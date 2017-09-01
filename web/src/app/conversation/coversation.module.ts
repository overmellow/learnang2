import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConversationRoutingModule } from './coversation-routing.module';
import { NewConversationService } from './new-conversation.service';
import { ConversationService } from './conversation.service'

import { ConversationsComponent } from './coversations.component'
import { NewConversationComponent } from './new-conversation.component'

@NgModule({
  imports: [
    CommonModule,
    ConversationRoutingModule
  ],
  declarations: [
    ConversationsComponent,
    NewConversationComponent
  ],
  providers: [
    ConversationService,
    NewConversationService
  ]
})
export class ConversationModule { }
