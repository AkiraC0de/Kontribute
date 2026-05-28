import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const GuessRoute = ({children}) => {
  const { isAuthenticating, isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticating) {
    return <div>Loading...</div>;
  }

  // already logged in
  if (isAuthenticated) {
    return <Navigate to="/main" replace />;
  }

  return children;
}
export default GuessRoute;