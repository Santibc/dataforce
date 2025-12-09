// @mui
// components
// assets
//
import { Navigate, useLocation } from 'react-router';
import { PATH_AFTER_LOGIN } from 'src/config';
import { PATHS } from 'src/routes/paths';
import { useAuthContext } from './useAuthContext';
import { isPathAuthorized } from './utils';

// ----------------------------------------------------------------------

type RoleBasedGuardProp = {
  children: React.ReactNode;
};

export default function RoleBasedGuard({ children }: RoleBasedGuardProp) {
  // Logic here to get current user role
  const { roles: currentRoles } = useAuthContext();
  const location = useLocation();
  const isAuthorized = isPathAuthorized(currentRoles, location.pathname);
  if (!isAuthorized && currentRoles.includes('super_admin')) {
    return <Navigate to={PATHS.superAdmin.root} />;
  }
  if (!isAuthorized) {
    return <Navigate to={PATH_AFTER_LOGIN} />;
  }

  return <>{children}</>;
}
