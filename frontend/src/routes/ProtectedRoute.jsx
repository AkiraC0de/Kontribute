import { Navigate, Outlet } from 'react-router';
import useAuth from "../hooks/useAuth";

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>; // Prevent flash of unauth state

  return user ? <Outlet /> : <Navigate to="/auth/login" />;
};

export default ProtectedRoute;
