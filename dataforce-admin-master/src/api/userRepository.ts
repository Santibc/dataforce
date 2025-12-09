import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from 'src/models/User';
import { httpClient } from 'src/utils/httpClient';
import { useSuspenseQuery } from 'src/utils/useSupenseQuery';

interface ICreateAdminUser {
  email: string;
  password: string;
  password_confirmation: string;
  roles: string[];
}

interface IEditUser {
  email: string;
  roles: string[];
  id: number;
}

interface IChangePasswordUser {
  password: string;
  password_confirmation: string;
  id: number;
}

export const getUserMapper = (x: any): User => x;

export const createUserMapper = (x: ICreateAdminUser) => x;

export class UserRepository {
  keys = {
    all: () => ['users'],
    one: (id: number) => ['users', id],
  };

  getAll = async () => {
    const { data } = await httpClient.get<any[]>('admin-users');
    return data.map(getUserMapper);
  };

  find = async (id: number) => {
    const { data } = await httpClient.get(`admin-users/${id}`);
    return getUserMapper(data);
  };

  create = (user: ICreateAdminUser) => httpClient.post('admin-users', user);

  edit = async (user: IEditUser) => httpClient.put('admin-users/' + user.id, user);

  changePassword = async (user: IChangePasswordUser) =>
    httpClient.put(`admin-users/${user.id}/change-password`, user);

  remove = async (id: number) => httpClient.delete('admin-users/' + id);
}

const repo = new UserRepository();

export const useAllUsersQuery = () =>
  useSuspenseQuery({ queryKey: repo.keys.all(), queryFn: repo.getAll });

export const useUserQuery = (id: number) =>
  useSuspenseQuery({ queryKey: repo.keys.one(id), queryFn: () => repo.find(id) });

export const useCreateUserMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.create,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.all());
    },
  });
};
export const useDeleteUserMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.remove,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.all());
    },
  });
};
export const useEditUserMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.edit,
    onSuccess: (_, vars) => {
      qc.invalidateQueries(repo.keys.one(vars.id));
    },
  });
};

export const useChangePasswordMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.changePassword,
    onSuccess: (_, vars) => {
      qc.invalidateQueries(repo.keys.one(vars.id));
    },
  });
};
