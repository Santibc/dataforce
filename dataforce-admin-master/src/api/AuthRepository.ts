import { useMutation, useQuery } from '@tanstack/react-query';
import { User } from 'src/models/User';
import { httpClient } from 'src/utils/httpClient';

type IUpdatePassword = {
  code: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type IVerifyCode = {
  code: string;
};

type IResetPassword = {
  email: string;
};

type IRegister = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};
export class AuthRepository {
  login = (x: { email: string; password: string }) => httpClient.post<string>('login', x);

  getLoggedUser = () => httpClient.get<User>('admin/users/me');

  updatePassword = (args: IUpdatePassword) =>
    new Promise((res) => {
      setTimeout(() => {
        res('OK');
        alert('TODO');
      }, 4000);
    });

  verifyCode = (args: IVerifyCode) =>
    new Promise((res) => {
      setTimeout(() => {
        res('OK');
        alert('TODO');
      }, 4000);
    });

  resetPassword = (args: IResetPassword) => httpClient.post('admin/forgot-password', args);

  userResetPassword = (args: {
    email: string;
    password: string;
    password_confirmation: string;
    token: string;
  }) => httpClient.post('admin/reset-password', args);
}

const repo = new AuthRepository();

export const useLoginMutation = () => useMutation({ mutationFn: repo.login });
export const useUpdatePasswordMutation = () => useMutation({ mutationFn: repo.updatePassword });
export const useVerifyCodeMutation = () => useMutation({ mutationFn: repo.verifyCode });
export const useResetPasswordMutation = () => useMutation({ mutationFn: repo.resetPassword });
export const useUserResetPasswordMutation = () =>
  useMutation({ mutationFn: repo.userResetPassword });
export const useGetLoggedUserQuery = () =>
  useQuery({ queryFn: repo.getLoggedUser, queryKey: ['logged-user'] });
