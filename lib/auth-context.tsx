"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  authApi,
  usersApi,
  clearTokens,
  getTokens,
  type UserProfile,
  type PersonalityScores,
} from "@/lib/api-client";

interface AuthContextValue {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string, fullName?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  savePersonality: (scores: PersonalityScores) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const profile = await authApi.getMe();
      setUser(profile);
    } catch {
      setUser(null);
      clearTokens();
    }
  }, []);

  // Check existing session on mount
  useEffect(() => {
    const { accessToken } = getTokens();
    if (accessToken) {
      refreshUser().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [refreshUser]);

  const login = async (emailOrUsername: string, password: string) => {
    const isEmail = emailOrUsername.includes("@");
    await authApi.login({
      ...(isEmail ? { email: emailOrUsername } : { username: emailOrUsername }),
      password,
      device_type: "web",
    });
    await refreshUser();
  };

  const register = async (
    email: string,
    username: string,
    password: string,
    fullName?: string
  ) => {
    await authApi.register({
      email,
      username,
      password,
      full_name: fullName,
      device_type: "web",
    });
    await refreshUser();
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    const updated = await usersApi.updateProfile(data);
    setUser(updated);
  };

  const savePersonality = async (scores: PersonalityScores) => {
    const updated = await usersApi.savePersonality(scores);
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        savePersonality,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
