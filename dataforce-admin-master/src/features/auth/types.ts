// ----------------------------------------------------------------------

import { StripeSubscriptionStatus } from 'src/api/companyPlanInfoRepository';

export type ActionMapType<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type Role = 'super_admin' | 'admin';

export type AuthStateType = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  userId: string | number | undefined;
  stripeSubscriptionStatus?: StripeSubscriptionStatus | null;
  roles: Role[];
  user: LoggedUser;
};

export type LoggedUser = {
  displayName: string;
  role: string;
  photoURL: string;
  email: string;
};

// ----------------------------------------------------------------------

export type JWTContextType = {
  method: 'jwt';
  isAuthenticated: boolean;
  isInitialized: boolean;
  stripeSubscriptionStatus?: StripeSubscriptionStatus | null;
  login: (x: { email: string; password: string }) => Promise<any>;
  logout: () => void;
  roles: Role[];
  userId: string | number | undefined;
  isSuperAdmin: () => boolean;
  user: LoggedUser;
};
