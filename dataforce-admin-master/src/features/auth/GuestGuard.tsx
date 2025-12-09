import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { PATH_AFTER_LOGIN } from 'src/config';
// components
import LoadingScreen from '../../components/loading-screen';
//
import { PATHS } from 'src/routes/paths';
import { useAuthContext } from './useAuthContext';

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: ReactNode;
};

export default function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, isInitialized, roles } = useAuthContext();

  if (roles.includes('super_admin')) {
    return <Navigate to={PATHS.superAdmin.root} />;
  }
  if (isAuthenticated) {
    return <Navigate to={PATH_AFTER_LOGIN} />;
  }

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
