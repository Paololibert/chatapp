
export interface Participant {
  id: number;
  username: string;
}

export interface Message {
  id: number;
  content: string;
  timestamp: string;
  sender: Participant;
}

export interface Chat {
  id: number;
  participants: Participant[];
  messages: Message[];
}
