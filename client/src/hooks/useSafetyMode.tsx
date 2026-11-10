import React, { createContext, useContext, useState, useEffect } from 'react';
import { SafetyMode } from '../types';

interface SafetyModeContextType {
  mode: SafetyMode;
  setMode: (mode: SafetyMode) => void;
  hasOnboarded: boolean;
  completeOnboarding: (mode: SafetyMode) => void;
}

const SafetyModeContext = createContext<SafetyModeContextType | undefined>(undefined);

export const SafetyModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<SafetyMode>(() => {
    const saved = localStorage.getItem('shieldsafe_mode');
    return (saved as SafetyMode) || 'everyday';
  });

  const [hasOnboarded, setHasOnboarded] = useState<boolean>(() => {
    return localStorage.getItem('shieldsafe_onboarded') === 'true';
  });

  const setMode = (newMode: SafetyMode) => {
    setModeState(newMode);
    localStorage.setItem('shieldsafe_mode', newMode);
  };

  const completeOnboarding = (selectedMode: SafetyMode) => {
    setMode(selectedMode);
    setHasOnboarded(true);
    localStorage.setItem('shieldsafe_onboarded', 'true');
  };

  return (
    <SafetyModeContext.Provider value={{ mode, setMode, hasOnboarded, completeOnboarding }}>
      {children}
    </SafetyModeContext.Provider>
  );
};

export const useSafetyMode = () => {
  const context = useContext(SafetyModeContext);
  if (!context) {
    throw new Error('useSafetyMode must be used within a SafetyModeProvider');
  }
  return context;
};
