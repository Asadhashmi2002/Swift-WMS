import { create } from 'zustand';
import { WizardState } from '../types';
import { saveWizardProgress, loadWizardProgress, clearWizardProgress } from '../lib/utils';

interface WizardStore extends WizardState {
  setCurrentStep: (step: number) => void;
  setData: (data: Partial<WizardState['data']>) => void;
  nextStep: () => void;
  prevStep: () => void;
  complete: () => void;
  reset: () => void;
  loadProgress: () => void;
}

const initialState: WizardState = {
  currentStep: 1,
  completed: false,
  data: {},
};

export const useWizardStore = create<WizardStore>((set, get) => ({
  ...initialState,

  setCurrentStep: (step) => {
    set({ currentStep: step });
    saveWizardProgress(get());
  },

  setData: (newData) => {
    set((state) => ({
      data: { ...state.data, ...newData },
    }));
    saveWizardProgress(get());
  },

  nextStep: () => {
    const { currentStep } = get();
    if (currentStep < 6) {
      set({ currentStep: currentStep + 1 });
      saveWizardProgress(get());
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1 });
      saveWizardProgress(get());
    }
  },

  complete: () => {
    set({ completed: true });
    clearWizardProgress();
  },

  reset: () => {
    set(initialState);
    clearWizardProgress();
  },

  loadProgress: () => {
    const saved = loadWizardProgress();
    if (saved) {
      set(saved);
    }
  },
}));