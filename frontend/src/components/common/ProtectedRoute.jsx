import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router"

const ProtectedRoute = ({ children }) => {
  const { isAuthenticating, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (isAuthenticating) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate 
      to="/auth/login" 
      state={{ from: location.pathname + location.search }} 
      replace 
    />;
  }

  return children;
}

export default ProtectedRoute;