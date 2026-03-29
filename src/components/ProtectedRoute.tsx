import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children?: React.ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    const redirectMap: Record<UserRole, string> = {
      admin: '/admin/dashboard',
      manager: '/manager/approvals',
      employee: '/employee/expenses',
    };
    return <Navigate to={redirectMap[user.role]} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
