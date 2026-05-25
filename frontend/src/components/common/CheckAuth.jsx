import { Navigate } from "react-router"

const CheckAuth = ({ isAuthenticated, children }) => {
  return !isAuthenticated ?  <Navigate to="/auth/login"/> : children;
}

export default CheckAuth;