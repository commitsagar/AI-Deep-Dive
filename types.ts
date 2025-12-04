
export enum Feature {
  StyleMe = 'STYLE_ME',
  VirtualTryOn = 'VIRTUAL_TRY_ON',
  StylistChat = 'STYLIST_CHAT',
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
