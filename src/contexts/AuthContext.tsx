import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type UserRole = 'admin' | 'manager' | 'employee';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  company_id: number;
  company_currency: string;
  company_name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
}

interface SignupData {
  company_name: string;
  name: string;
  email: string;
  password: string;
  country: string;
  currency: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users for development
const MOCK_USERS: Record<string, User> = {
  'admin@acme.com': { id: 1, name: 'Rahul Sharma', email: 'admin@acme.com', role: 'admin', company_id: 1, company_currency: 'INR', company_name: 'Acme Corp' },
  'manager@acme.com': { id: 2, name: 'Priya Patel', email: 'manager@acme.com', role: 'manager', company_id: 1, company_currency: 'INR', company_name: 'Acme Corp' },
  'employee@acme.com': { id: 3, name: 'Amit Kumar', email: 'employee@acme.com', role: 'employee', company_id: 1, company_currency: 'INR', company_name: 'Acme Corp' },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('reimburse_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('reimburse_token'));

  const login = useCallback(async (email: string, _password: string) => {
    // Mock login
    const mockUser = MOCK_USERS[email];
    if (!mockUser) {
      // Default to admin for any email
      const newUser: User = { id: 1, name: 'Rahul Sharma', email, role: 'admin', company_id: 1, company_currency: 'INR', company_name: 'Acme Corp' };
      const mockToken = 'mock-jwt-token-' + Date.now();
      setUser(newUser);
      setToken(mockToken);
      localStorage.setItem('reimburse_user', JSON.stringify(newUser));
      localStorage.setItem('reimburse_token', mockToken);
      return;
    }
    const mockToken = 'mock-jwt-token-' + Date.now();
    setUser(mockUser);
    setToken(mockToken);
    localStorage.setItem('reimburse_user', JSON.stringify(mockUser));
    localStorage.setItem('reimburse_token', mockToken);
  }, []);

  const signup = useCallback(async (data: SignupData) => {
    const newUser: User = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      role: 'admin',
      company_id: 1,
      company_currency: data.currency,
      company_name: data.company_name,
    };
    const mockToken = 'mock-jwt-token-' + Date.now();
    setUser(newUser);
    setToken(mockToken);
    localStorage.setItem('reimburse_user', JSON.stringify(newUser));
    localStorage.setItem('reimburse_token', mockToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('reimburse_user');
    localStorage.removeItem('reimburse_token');
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
