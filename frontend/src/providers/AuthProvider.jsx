import { createContext, useState, useEffect } from "react";
import apiRequest from "../api/api";

export const AuthContext = createContext();

const AuthProvider = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem("accessToken");
      
      if (token) {
        try {
          // Verify token with backend
          const res = await apiRequest.get("/api/v1/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
          });

          setUser(res.data.user);
        } catch (error) {
          // If token is invalid/expired, remove it
          localStorage.removeItem("accessToken");
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}> 

    </AuthContext.Provider>
  )
}
export default AuthProvider