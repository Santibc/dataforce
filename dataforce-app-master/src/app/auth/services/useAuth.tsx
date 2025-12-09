import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LoginCredentials} from 'app/auth/models/User';
import jwtDecode from 'jwt-decode';
import {httpClient} from 'app/main/services/httpClient';

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (x: LoginCredentials) => Promise<any>;
  logout: () => void;
  loggedUserID: number | undefined;
  forgotPassword: (x: {email: string}) => Promise<void>;
  register: (x: {
    email: string;
    name: string;
    password: string;
    passwordRepeat: string;
  }) => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = (props: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedUserID, setLoggedUserID] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    AsyncStorage.getItem('token').then(token => setIsAuthenticated(!!token));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      AsyncStorage.getItem('token').then(token => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const {user_id} = jwtDecode<{user_id: number}>(token!);
        setLoggedUserID(user_id);
      });
    }
  }, [isAuthenticated]);

  async function login(args: {email: string; password: string}) {
    const {token} = await httpClient.post<{token: string}>('login', args);
    AsyncStorage.setItem('token', token);
    setIsAuthenticated(true);
    return token;
  }

  function logout() {
    AsyncStorage.removeItem('token');
    setIsAuthenticated(false);
  }

  function forgotPassword({email}: {email: string}) {
    return httpClient.post('forgot-password', {email});
  }

  function register(x: {
    email: string;
    name: string;
    password: string;
    passwordRepeat: string;
  }) {
    return httpClient.post('register', {
      email: x.email,
      password: x.password,
      password_confirmation: x.passwordRepeat,
      name: x.name,
    });
  }

  const value: AuthContextType = {
    isAuthenticated,
    login,
    logout,
    loggedUserID,
    forgotPassword,
    register,
  };
  return <AuthContext.Provider value={value} {...props} />;
};

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (!authContext.login) {
    throw new Error('useAuth debe estar dentro del proveedor AuthContext');
  }
  return authContext;
};
