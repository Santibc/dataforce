import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { httpClient } from 'src/utils/httpClient';

export interface ICreateUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone_number: string;
  driver_amazon_id: string;
  jobsites_id: number[];
  positions_id: number[];
  roles: string[];
  company_id: number;
}

export interface IUpdateUser {
  company_id: number;
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone_number: string;
  driver_amazon_id: string;
  jobsites_id: number[];
  positions_id: number[];
  roles: string | string[];
}

export interface IRecievedUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone_number: string;
  driver_amazon_id: string;
  jobsites: IJobsitesForUser[];
  positions_id: number[];
  positions: { id: number; name: string }[];
  roles: string[];
}

export interface IJobsitesForUser {
  address_street: string;
  city: string;
  id: number;
  name: string;
  state: string;
  zip_code: string;
}

export const recievedUserMapper = (x: any): IRecievedUser => x;

export class UserRepository {
  keys = {
    all: () => ['users'],
    one: (id: number) => ['users', id],
  };

  getAll = async () => {
    const { data } = await httpClient.get<any[]>('admin/users');
    return data.map(recievedUserMapper);
  };

  find = async (id: number) => {
    const { data } = await httpClient.get(`admin/users/${id}`);
    return recievedUserMapper(data);
  };

  create = (jobsite: ICreateUser) => httpClient.post('admin/users', jobsite);

  update = async (jobsite: IUpdateUser) => httpClient.put(`admin/users/${jobsite.id}`, jobsite);

  delete = async (id: number) => httpClient.delete(`admin/users/${id}`);

  import = (excel: { file: File }) =>
    httpClient.post('admin/users/import', excel, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
}

const repo = new UserRepository();

export const useAllUsersQuery = () => useQuery({ queryKey: repo.keys.all(), queryFn: repo.getAll });

export const useFindUserQuery = (id: number) =>
  useQuery({ queryKey: repo.keys.one(id), queryFn: () => repo.find(id) });

export const useCreateUserMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.create,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.all());
    },
  });
};

export const useUpdateUserMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.update,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.all());
    },
  });
};

export const useDeleteUserMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.delete,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.all());
    },
  });
};

export const useImportExcelMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.import,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.all());
      enqueueSnackbar('Excel imported successfully!', { variant: 'success' });
    },
  });
};
