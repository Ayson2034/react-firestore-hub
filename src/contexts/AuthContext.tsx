import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";
import { getUserById } from "@/services/firestore";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("jh_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Verify user still exists
        getUserById(parsed.id).then((u) => {
          if (u) {
            setUserState(u);
          } else {
            localStorage.removeItem("jh_user");
          }
          setLoading(false);
        });
      } catch {
        localStorage.removeItem("jh_user");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const setUser = (user: User | null) => {
    setUserState(user);
    if (user) {
      localStorage.setItem("jh_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("jh_user");
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
