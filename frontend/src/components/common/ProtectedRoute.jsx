import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router"
import { motion, AnimatePresence } from "motion/react";
import Spinner from "./Spinner";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticating, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate 
      to="/auth/login" 
      state={{ from: location.pathname + location.search }} 
      replace 
    />;
  }

  if(isAuthenticating){
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    )
  }

  return children;
}

export default ProtectedRoute;