
export enum View {
  LANDING = 'LANDING',
  CHATTING = 'CHATTING',
  ANALYZING = 'ANALYZING',
  TRIAGE = 'TRIAGE',
  WAITING = 'WAITING',
  PROPOSAL = 'PROPOSAL',
  PAYMENT = 'PAYMENT',
  CONFIRMED = 'CONFIRMED'
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface SupportGroup {
  id: string;
  theme: string;
  focus: string;
  description: string;
  therapist: {
    name: string;
    imageUrl: string;
    credentials: string;
  };
  details?: {
    dateTime: string;
    price: string;
  };
}

export interface AnalysisResponse {
  summary: string;
  theme: string;
  insight: string;
  groupMatch: SupportGroup;
}
