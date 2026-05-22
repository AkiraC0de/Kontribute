import { createContext, useState, useEffect } from "react";
import apiRequest from "../api/server";
import { getAccessToken, removeAccessToken, setAccessToken } from "../utils/token";

export const AuthContext = createContext();

const tempLogin = () => {
  fetch("http://localhost:5000/api/v1/auth/login", {
    method: "POST",
    credentials: "include", // <-- CRITICAL: This is what tells the browser to catch and save the cookie!
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      "identifier": "ravenakira10@gmail.com",
      "password": "Ravenakira10"
    })
  })
  .then(res => {
    console.log("Status Code:", res.status);
    return res.json();
  })
  .then(data => console.log("Response Body:", data))
  .catch(err => console.error("Error:", err));
}

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const accessToken = getAccessToken();

      try {
        if(!accessToken){
          const data = await apiRequest.refreshToken();
          return setUser(data.user);
        } 
          
        const data = await apiRequest.get("/api/v1/auth/me");
        setUser(data.user);
      } catch (error) {
        removeAccessToken();
        console.log("Authentication failed: Proceed to login.") ;
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