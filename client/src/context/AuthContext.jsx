import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../api/services";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in when app starts
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const { data } = await authService.getProfile();
          setUser(data);
        } catch (err) {
          console.error("Session expired");
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await authService.login(email, password);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (userData) => {
    const { data } = await authService.register(userData);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};