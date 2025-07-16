import { create } from 'zustand';
import { AuthState, User } from '../types';
import { mockApi } from '../lib/mockApi';
import { socketService } from '../lib/socket';

interface AuthStore extends AuthState {
  login: (credentials: { email?: string; phone?: string; password: string; otp?: string }) => Promise<void>;
  logout: () => void;
  verifyOtp: (phone: string, otp: string) => Promise<boolean>;
  sendOtp: (phone: string) => Promise<void>;
  setTwoFactorEnabled: (enabled: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isTwoFactorEnabled: false,
  loading: false,

  login: async (credentials) => {
    set({ loading: true });
    try {
      const { user, token } = await mockApi.login(credentials);
      
      // Store token in secure cookie (mock)
      document.cookie = `auth_token=${token}; secure; httponly`;
      
      // Connect to socket
      socketService.connect(token);
      
      set({ 
        user, 
        isAuthenticated: true, 
        loading: false 
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: () => {
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    socketService.disconnect();
    set({ 
      user: null, 
      isAuthenticated: false, 
      isTwoFactorEnabled: false 
    });
  },

  verifyOtp: async (phone: string, otp: string) => {
    const { valid } = await mockApi.verifyOtp(phone, otp);
    return valid;
  },

  sendOtp: async (phone: string) => {
    await mockApi.sendOtp(phone);
  },

  setTwoFactorEnabled: (enabled: boolean) => {
    set({ isTwoFactorEnabled: enabled });
  },
}));