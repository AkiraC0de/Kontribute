import { createContext, useState, useEffect } from "react";
import apiRequest from "../api/server";

export const AuthContext = createContext();

const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      localStorage.setItem("accessToken", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2YTA4NDEzYjE2OGVkZTU0ODUwNmIzMGUiLCJyb2xlIjoidXNlciIsImlhdCI6MTc3OTQ2NTI1OSwiZXhwIjoxNzc5NDY2MTU5fQ._UfcdMnNehaapOhy6tZgAC4qFTulQ7yHIlxVmaAFyGQ")
      const token = localStorage.getItem("accessToken");

      

      if (token) {
        try {
          // Verify token with backend
          const res = await apiRequest.get("/api/v1/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
          });

          console.log(res)

          //setUser(res.data.user);
        } catch (error) {
          console.log(error);
          // If token is invalid/expired, remove it
          localStorage.removeItem("accessToken");
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    checkLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading }}> 
      {children}
    </AuthContext.Provider>
  )
}
export default AuthProvider