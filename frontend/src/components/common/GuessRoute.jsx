import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion"; // Note: Ensure your import matches your package (framer-motion vs motion/react)
import Spinner from "./Spinner";

const GuessRoute = ({ children }) => {
  const { isAuthenticating, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (isAuthenticated) {
    const fromUrl = location.state?.from || "/main/dashboard";
    return <Navigate to={fromUrl} replace />;
  }

  if(isAuthenticating){
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    )
  }

  return children;
};

export default GuessRoute;