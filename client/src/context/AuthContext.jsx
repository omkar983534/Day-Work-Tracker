import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check an existing token

  // On first load, if we have a token, ask the server who we are
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  const handleAuthSuccess = ({ user, token }) => {
    localStorage.setItem("token", token);
    setUser(user);
  };

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    handleAuthSuccess(res.data);
    return res.data.user;
  };

  const signup = async (name, email, password) => {
    const res = await api.post("/auth/signup", { name, email, password });
    handleAuthSuccess(res.data);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = { user, loading, login, signup, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Small helper hook so components can do: const { user, login } = useAuth();
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
