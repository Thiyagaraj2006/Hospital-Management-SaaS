import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("medicare_user");
    const storedToken = localStorage.getItem("medicare_token");
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("medicare_user");
      }
    }
    setLoading(false);
  }, []);

  function persistSession(token, userData) {
    localStorage.setItem("medicare_token", token);
    localStorage.setItem("medicare_user", JSON.stringify(userData));
    setUser(userData);
  }

  async function login(credentials) {
    const data = await authService.login(credentials);
    persistSession(data.token, data.user);
    return data.user;
  }

  async function register(payload) {
    const data = await authService.register(payload);
    persistSession(data.token, data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem("medicare_token");
    localStorage.removeItem("medicare_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
