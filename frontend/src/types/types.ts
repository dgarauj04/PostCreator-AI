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

export interface PostSuggestion {
  postText: string;
  hashtags: string[];
  imageVideoSuggestion: string;
  platform: SocialPlatform;
  improvementTips: string[];
}

export interface SavedPost extends PostSuggestion {
    id: string;
    savedAt: number;
}

export interface User {
  email: string;
  accessToken?: string;
}

export interface AuthResponse {
  message: string;
  access_token: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}