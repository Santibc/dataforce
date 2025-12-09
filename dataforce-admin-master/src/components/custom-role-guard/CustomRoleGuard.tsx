import React, { FC } from 'react';
import { useAuthContext } from 'src/features/auth/useAuthContext';

interface CustomRoleGuardProps {
  children: React.ReactNode;
  roles: string[];
}

const isPathAuthorized = (userRoles: string[], acceptedRoles: string[]): boolean => {
  for (const role of userRoles) {
    if (acceptedRoles.includes(role)) {
      return true;
    }
  }
  return false;
};

/**
 * CustomRoleGuard is a component that renders its children only if the current user has the specified roles.
 *
 * @param {React.ReactNode} props.children - The children elements to render.
 * @param {string[]} props.roles - The roles required for the user to render the children.
 * @returns {React.ReactNode} - Returns the children elements if the user has the required roles; otherwise, returns `React.Fragment`.
 */
export const CustomRoleGuard: FC<CustomRoleGuardProps> = ({ children, roles }) => {
  const { roles: currentRoles } = useAuthContext();
  const isAuthorized = isPathAuthorized(currentRoles, roles);

  if (!isAuthorized) {
    return <></>;
  }

  return (
    <>{children}</>
  );
}