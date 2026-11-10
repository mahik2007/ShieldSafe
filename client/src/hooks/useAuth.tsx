import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  safetyMode: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, safetyMode?: string) => Promise<void>;
  logout: () => void;
  updateUserSafetyMode: (mode: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('shecurity_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('shecurity_token');
  });

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('shecurity_user', JSON.stringify(data.user));
    localStorage.setItem('shecurity_token', data.token);
  };

  const register = async (name: string, email: string, password: string, safetyMode = 'everyday') => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, safetyMode }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('shecurity_user', JSON.stringify(data.user));
    localStorage.setItem('shecurity_token', data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('shecurity_user');
    localStorage.removeItem('shecurity_token');
    localStorage.removeItem('shieldsafe_safety_mode');
    localStorage.removeItem('shieldsafe_onboarding_completed');
  };

  const updateUserSafetyMode = async (mode: string) => {
    if (!user) return;
    try {
      await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, safetyMode: mode }),
      });
      const updated = { ...user, safetyMode: mode };
      setUser(updated);
      localStorage.setItem('shecurity_user', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to sync safety profile with backend:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        updateUserSafetyMode,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

