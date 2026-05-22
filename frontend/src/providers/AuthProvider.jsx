import { createContext, useState, useEffect } from "react";
import apiRequest from "../api/server";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        try {
          await apiRequest.refreshToken();
        } catch (refreshError) {
          setIsLoading(false);
          return;
        }
      }

      try {
        const res = await apiRequest.get("/v1/auth/me");

        setUser(res.user || res);
      } catch (error) {
        console.error("Auth check failed:", error.message);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser }}> 
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;