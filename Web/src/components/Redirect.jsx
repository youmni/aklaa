import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Redirect = ({ allowedRoles = ['ADMIN', 'USER'] }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/auth/login" replace />;

  if (allowedRoles.includes(user.userType)) {
    return user.userType === 'ADMIN' ? (
      <Navigate to="/admin" replace />
    ) : (
      <Navigate to="/" replace />
    );
  }

  return <Navigate to="/auth/login" replace />;
};

export default Redirect;