import { create } from 'zustand';
import { BroadcastState, BroadcastTemplate, Broadcast } from '../types';
import { mockApi } from '../lib/mockApi';

interface BroadcastStore extends BroadcastState {
  loadTemplates: () => Promise<void>;
  createTemplate: (template: Omit<BroadcastTemplate, 'id'>) => Promise<void>;
  sendBroadcast: (broadcast: Omit<Broadcast, 'id' | 'stats'>) => Promise<void>;
  setCurrentBroadcast: (broadcast: Partial<Broadcast> | null) => void;
}

export const useBroadcastStore = create<BroadcastStore>((set, get) => ({
  templates: [],
  broadcasts: [],
  currentBroadcast: null,

  loadTemplates: async () => {
    try {
      const templates = await mockApi.getTemplates();
      set({ templates });
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  },

  createTemplate: async (template) => {
    try {
      const newTemplate = await mockApi.createTemplate(template);
      set(state => ({
        templates: [...state.templates, newTemplate],
      }));
    } catch (error) {
      console.error('Failed to create template:', error);
      throw error;
    }
  },

  sendBroadcast: async (broadcast) => {
    try {
      const newBroadcast = await mockApi.sendBroadcast(broadcast);
      set(state => ({
        broadcasts: [...state.broadcasts, newBroadcast],
        currentBroadcast: null,
      }));
    } catch (error) {
      console.error('Failed to send broadcast:', error);
      throw error;
    }
  },

  setCurrentBroadcast: (broadcast) => {
    set({ currentBroadcast: broadcast });
  },
}));