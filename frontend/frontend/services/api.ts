import axios from 'axios';
import type { 
  User, 
  LoginCredentials, 
  SignupData, 
  AuthResponse,
  VoiceAnalysis,
  TextAnalysis,
  TextInput 
} from '../types';

// Base API URL - Change this to your backend URL
const API_URL='https://socialsieve-b.onrender.com';
// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/signup', data);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

// Voice API
export const voiceAPI = {
  analyze: async (audioFile: File): Promise<VoiceAnalysis> => {
    const formData = new FormData();
    formData.append('audio', audioFile);

    const response = await api.post('/api/voice/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getHistory: async (): Promise<VoiceAnalysis[]> => {
    const response = await api.get('/api/voice/history');
    return response.data;
  },

  getById: async (id: string): Promise<VoiceAnalysis> => {
    const response = await api.get(`/api/voice/${id}`);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/voice/${id}`);
  },
};

// Text API
export const textAPI = {
  analyze: async (data: TextInput): Promise<TextAnalysis> => {
    const response = await api.post('/api/text/analyze', data);
    return response.data;
  },

  getHistory: async (): Promise<TextAnalysis[]> => {
    const response = await api.get('/api/text/history');
    return response.data;
  },

  getById: async (id: string): Promise<TextAnalysis> => {
    const response = await api.get(`/api/text/${id}`);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/text/${id}`);
  },
};
