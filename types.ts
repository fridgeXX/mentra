
export enum View {
  LANDING = 'LANDING',
  CHATTING = 'CHATTING',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS'
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface TherapistMatch {
  name: string;
  specialty: string;
  matchScore: number;
  description: string;
  imageUrl: string;
}

export interface AnalysisResponse {
  summary: string;
  matches: TherapistMatch[];
  suggestedAction: string;
}
