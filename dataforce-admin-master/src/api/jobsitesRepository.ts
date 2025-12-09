import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { httpClient } from 'src/utils/httpClient';
import { IRecievedUser } from './usersRepository';

export interface ICreateJobsite {
  name: string;
  address_street: string;
  state: string;
  city: string;
  zip_code: string;
  users_id: number[];
}

export interface IUpdateJobsite {
  id: number;
  name: string;
  address_street: string;
  state: string;
  city: string;
  zip_code: string;
  users_id: number[];
}

export interface IRecievedJobsite {
  id: number;
  name: string;
  address_street: string;  
  state: string;
  city: string;
  zip_code: string;
  users: IRecievedUser[];
}

export const recievedJobsiteMapper = (x: any): IRecievedJobsite => x;

export class JobsiteRepository {
  keys = {
    all: () => ['jobsites'],
    one: (id: number) => ['jobsites', id],
  };

  getAll = async () => {
    const { data } = await httpClient.get<any[]>('admin/jobsites');
    return data.map(recievedJobsiteMapper);
  };

  find = async (id: number) => {
    const { data } = await httpClient.get(`admin/jobsites/${id}`);
    return recievedJobsiteMapper(data);
  };

  create = (jobsite: ICreateJobsite) => httpClient.post('admin/jobsites', jobsite);

  update = async (jobsite: IUpdateJobsite) =>
    httpClient.put(`admin/jobsites/${jobsite.id}`, jobsite);

  delete = async (id: number) => httpClient.delete(`admin/jobsites/${id}`);
}

const repo = new JobsiteRepository();

export const useAllJobsitesQuery = () =>
  useQuery({ queryKey: repo.keys.all(), queryFn: repo.getAll });

export const useFindJobsiteQuery = (id: number) =>
  useQuery({ queryKey: repo.keys.one(id), queryFn: () => repo.find(id) });

export const useCreateJobsiteMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.create,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.all());
    },
  });
};

export const useUpdateJobsiteMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.update,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.all());
    },
  });
};

export const useDeleteJobsiteMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.delete,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.all());
    },
  });
};
