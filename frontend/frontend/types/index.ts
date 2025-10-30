// User types
export interface User {
  id: string;
  email: string;
  name: string;
  plan: string;
  created_at: string;
  usage: {
    voice_minutes_used: number;
    comments_analyzed: number;
    last_reset: string;
  };
  limits: {
    voice_minutes_per_month: number;
    comments_per_month: number;
  };
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  name: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// Voice Analysis types
export interface VoiceAnalysis {
  id: string;
  file_name: string;
  audio_url: string;
  duration_seconds: number;
  transcript: string;
  summary: string;
  action_items: string[];
  language: string;
  created_at: string;
}

// Text Analysis types
export interface TextAnalysis {
  id: string;
  text: string;
  summary: string;
  action_items: string[];
  character_count: number;
  analyzed_at: string;
}

export interface TextInput {
  text: string;
}