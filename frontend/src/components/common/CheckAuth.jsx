import { useSelector } from "react-redux";
import { Navigate } from "react-router"

const CheckAuth = ({ children }) => {
  const { isAuthenticating, user } = useSelector((state) => state.auth);

  if(isAuthenticating){
    return <div>Loading...</div>
  }

  return !user ?  <Navigate to="/auth/login"/> : children;
}

export default CheckAuth;