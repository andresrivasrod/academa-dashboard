import React, { createContext, useContext, useState, useEffect } from "react";
import { loginRequest, logoutRequest } from "@/lib/api";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

// ✅ helper global para usar el token en otros módulos
export function getAuthToken(): string | null {
  return localStorage.getItem("accessToken");
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("accessToken"));
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await loginRequest(email, password);
      setIsAuthenticated(true);
      return true;
    } catch (e: any) {
      console.error("Login error:", e);
      setIsAuthenticated(false);
      return false;
    }
  };

  const logout = () => {
    logoutRequest().catch(() => {});
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
