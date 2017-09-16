import { Conversation } from './conversation'

export class MyConversation {
  conversation: Conversation;
  seen: string;
  newMessageNotification: number = undefined;
  actualNewMessageNotification = undefined;
  actualmessages = [];
}
  