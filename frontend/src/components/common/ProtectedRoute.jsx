import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router"
import { motion, AnimatePresence } from "motion/react";
import Spinner from "./Spinner";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  // if (!isAuthenticated) {
  //   return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  // }

  return children;
}

export default ProtectedRoute;