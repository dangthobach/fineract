'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email?: string;
  roles: string[];
  permissions: string[];
  office?: {
    id: string;
    name: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user has a valid session
        const token = localStorage.getItem('fineract_token');
        if (token) {
          // Validate token and fetch user data
          // This would be replaced with actual API call
          await fetchCurrentUser();
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const fetchCurrentUser = async () => {
    // This would be replaced with actual API call to Fineract
    // For now, using mock data
    const mockUser: User = {
      id: '1',
      username: 'admin',
      firstName: 'System',
      lastName: 'Administrator',
      email: 'admin@fineract.org',
      roles: ['SUPER_USER'],
      permissions: ['ALL_FUNCTIONS'],
      office: {
        id: '1',
        name: 'Head Office',
      },
    };
    setUser(mockUser);
  };

  const login = async (username: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      // This would be replaced with actual API call to Fineract authentication endpoint
      // POST /authentication with base64 encoded credentials
      
      // Mock successful login
      const token = 'mock-jwt-token';
      localStorage.setItem('fineract_token', token);
      
      await fetchCurrentUser();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      localStorage.removeItem('fineract_token');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes('ALL_FUNCTIONS') || user.permissions.includes(permission);
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.roles.includes(role);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    hasPermission,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
