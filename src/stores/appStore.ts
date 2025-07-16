import { create } from 'zustand';
import { AppState, User, Theme } from '../types';
import { themes, defaultTheme } from '../lib/themes';
import { mockApi } from '../lib/mockApi';

interface AppStore extends AppState {
  setTheme: (theme: Theme) => void;
  setSidebarOpen: (open: boolean) => void;
  loadUsers: () => Promise<void>;
  createUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  canCreateUser: () => boolean;
}

export const useAppStore = create<AppStore>((set, get) => ({
  theme: defaultTheme,
  sidebarOpen: false,
  users: [],
  seatLimit: 10,

  setTheme: (theme) => {
    set({ theme });
    // Apply theme to document
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  },

  setSidebarOpen: (open) => {
    set({ sidebarOpen: open });
  },

  loadUsers: async () => {
    try {
      const users = await mockApi.getUsers();
      set({ users });
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  },

  createUser: async (user) => {
    const { users, seatLimit } = get();
    if (users.length >= seatLimit) {
      throw new Error(`Seat limit of ${seatLimit} reached`);
    }

    try {
      const newUser = await mockApi.createUser(user);
      set(state => ({
        users: [...state.users, newUser],
      }));
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  },

  updateUser: async (id, updates) => {
    try {
      const updatedUser = await mockApi.updateUser(id, updates);
      set(state => ({
        users: state.users.map(u => u.id === id ? updatedUser : u),
      }));
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      await mockApi.deleteUser(id);
      set(state => ({
        users: state.users.filter(u => u.id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    }
  },

  canCreateUser: () => {
    const { users, seatLimit } = get();
    return users.length < seatLimit;
  },
}));