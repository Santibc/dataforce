import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { httpClient } from 'src/utils/httpClient';

export interface ICreateRole {
  name: string;
}

export interface IUpdateRole {
  id: number;
  name: string;
}

export interface IRecievedRole {
  id: number;
  name: string;
}

export const recievedRoleMapper = (x: any): IRecievedRole => x;

export class RoleRepository {
  keys = {
    all: () => ['roles'],
    one: (id: number) => ['roles', id],
  };

  getAll = async () => {
    const { data } = await httpClient.get<any[]>('admin/roles');
    return data.map(recievedRoleMapper);
  };

  find = async (id: number) => {
    const { data } = await httpClient.get(`admin/roles/${id}`);
    return recievedRoleMapper(data);
  };

  create = (jobsite: ICreateRole) => httpClient.post('admin/roles', jobsite);

  update = async (jobsite: IUpdateRole) => httpClient.put(`admin/roles/${jobsite.id}`, jobsite);

  delete = async (id: number) => httpClient.delete(`admin/roles/${id}`);
}

const repo = new RoleRepository();

export const useAllRolesQuery = () => useQuery({ queryKey: repo.keys.all(), queryFn: repo.getAll });

export const useCreateRoleMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.create,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.all());
    },
  });
};

export const useUpdateRoleMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.update,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.all());
    },
  });
};

export const useDeleteRoleMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.delete,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.all());
    },
  });
};
