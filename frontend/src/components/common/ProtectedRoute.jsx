import { useSelector } from "react-redux";
import { Navigate } from "react-router"

const ProtectedRoute = ({ children }) => {
  const { isAuthenticating, user } = useSelector((state) => state.auth);

  if (isAuthenticating) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}

export default ProtectedRoute;