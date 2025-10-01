export interface User {
  id: string;
  email: string;
  username: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (loginIdentifier: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
}

export interface PostSuggestion {
  id: string;
  postText: string;
  hashtags: string[];
  improvementTips: string[];
  imageVideoSuggestion: string;
  platform: string;
}

export interface SavedPost extends PostSuggestion {
  savedAt: number;
}

export enum SocialPlatform {
  Instagram = "Instagram",
  LinkedIn = "LinkedIn",
  Twitter = "Twitter (X)",
  Facebook = "Facebook",
}

export enum ToneOfVoice {
  Professional = "Profissional",
  Friendly = "Amigável",
  Witty = "Engraçado",
  Inspirational = "Inspirador",
  Urgent = "Urgente",
}

export interface PostFormState {
  theme: string;
  platform: SocialPlatform;
  tone: ToneOfVoice;
}