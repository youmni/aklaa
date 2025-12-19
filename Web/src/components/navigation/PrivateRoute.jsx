import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/auth/login" />;

  if (allowedRoles && !allowedRoles.includes(user.userType)) {
    return <Navigate to="/not-found" />;
  }

  return <Outlet />;
};

export default PrivateRoute;