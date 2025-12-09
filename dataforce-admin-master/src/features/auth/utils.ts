import { matchPath } from 'react-router';
import { PATHS_PER_ROLE } from 'src/routes/paths';
import { httpClient } from 'src/utils/httpClient';
import { Role } from './types';

// ----------------------------------------------------------------------

export const setSession = (accessToken: string | null) => {
  httpClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
  } else {
    localStorage.removeItem('accessToken');
  }
};

export const isPathAuthorized = (userRoles: Role[], path: string) => {
  const authorizedPaths = PATHS_PER_ROLE.filter((path) =>
    userRoles.some((ur) => ur === path.role)
  ).flatMap((route) => route.paths);
  return authorizedPaths.some((authorizedPath) => matchPath(authorizedPath, path) !== null);
};
