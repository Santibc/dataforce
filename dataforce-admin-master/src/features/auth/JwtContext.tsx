import { createContext, useCallback, useEffect, useRef, useState } from 'react';
// utils
import { AuthRepository, useLoginMutation } from 'src/api/AuthRepository';
import {
  CompanyPlanInfoRepository,
  StripeSubscriptionStatus,
  SubscriptionInfoResponse,
} from 'src/api/companyPlanInfoRepository';
import { AuthStateType, JWTContextType, Role } from './types';
import { setSession } from './utils';

const initialState: AuthStateType = {
  isInitialized: false,
  isAuthenticated: false,
  userId: undefined,
  roles: [],
  stripeSubscriptionStatus: StripeSubscriptionStatus.incomplete,
  user: {
    displayName: '',
    role: '',
    photoURL: '',
    email: '',
  },
};

export const AuthContext = createContext<JWTContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: React.ReactNode;
};

const userRepo = new AuthRepository();
const companyPlanInfoRepo = new CompanyPlanInfoRepository();

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState(initialState);
  const loginMutation = useLoginMutation();
  const tokenExpirationTimeoutRef = useRef<NodeJS.Timeout>();

  const setStateFromToken = async (accessToken: string) => {
    // The user is fetched with the accessToken stored in localStorage
    // when using setSession
    try {
      const { data: user } = await userRepo.getLoggedUser();
      let userSubscription: SubscriptionInfoResponse | null = null;
      if (user.company_id !== null) {
        const { data } = await companyPlanInfoRepo.getSubscriptionInfo();
        userSubscription = data;
      }
      let loggedUser = {
        displayName: user.email,
        role: 'Estudiante',
        photoURL: '',
        email: user.email,
      };
      setState((x) => ({
        ...x,
        isAuthenticated: true,
        userId: user.id,
        roles: user.roles as Role[],
        isInitialized: true,
        stripeSubscriptionStatus: userSubscription?.status ? userSubscription.status : null,
        user: loggedUser,
      }));
    } catch (error) {
      logout();
    }
  };

  const initializeState = () =>
    setState((x) => ({
      ...x,
      isAuthenticated: false,
      userId: undefined,
      roles: [],
      isInitialized: true,
    }));

  const logout = useCallback(async () => {
    setSession(null);
    initializeState();
  }, []);

  const initialize = useCallback(async () => {
    try {
      const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : '';
      setSession(accessToken);
      if (accessToken) {
        setStateFromToken(accessToken);
      } else {
        initializeState();
      }
    } catch (error) {
      console.error(error);
      initializeState();
    }
    return () =>
      tokenExpirationTimeoutRef.current && clearTimeout(tokenExpirationTimeoutRef.current);
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = async ({ email, password }: { email: string; password: string }) => {
    const { data } = await loginMutation.mutateAsync({ email, password });
    console.log('🚀 ~ file: JwtContext.tsx:96 ~ login ~ data:', data);
    setSession(data);
    setStateFromToken(data);
  };

  const isSuperAdmin = () => (state.roles ?? []).includes('super_admin');

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        isSuperAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
