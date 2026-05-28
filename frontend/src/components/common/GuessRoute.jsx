import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router"; // <-- Import useLocation

const GuessRoute = ({ children }) => {
  const { isAuthenticating, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation(); 

  if (isAuthenticating) {
    return <div>Loading...</div>; 
  }

  if (isAuthenticated) {
    const fromUrl = location.state?.from || "/main/dashboard";
    return <Navigate to={fromUrl} replace />;
  }

  return children;
};

export default GuessRoute;