import React, { createContext, useContext, useState, useEffect } from "react";
import { loginRequest, logoutRequest, api } from "@/lib/api";

interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

// ✅ helper global para usar el token en otros módulos
export function getAuthToken(): string | null {
  return localStorage.getItem("accessToken");
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // 🔹 Al recargar la página, validar token y pedir datos del usuario
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsAuthenticated(true);
      fetchCurrentUser(); // <- obtiene datos del backend
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get<{ status: string; data: User }>("/auth/oauth/me");
      setUser(res.data);
    } catch (err) {
      console.error("❌ Error obteniendo usuario logueado:", err);
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { user: loggedUser } = await loginRequest(email, password);
      setIsAuthenticated(true);
      setUser(loggedUser); // 🔹 Guardamos el usuario del login
      return true;
    } catch (e: any) {
      console.error("Login error:", e);
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
  };

  const logout = () => {
    logoutRequest().catch(() => {});
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
