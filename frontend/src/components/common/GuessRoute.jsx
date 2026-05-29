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

  return (
    <AnimatePresence mode="wait">
      {isAuthenticating ? (
        <motion.div
          key="spinner"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center justify-center h-screen"
        >
          <Spinner />
        </motion.div>
      ) : (
        <motion.div
          key={location.pathname} 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }} 
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GuessRoute;