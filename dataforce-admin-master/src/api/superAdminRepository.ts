import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Moment } from 'moment';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router';
import { PATHS } from 'src/routes/paths';
import { httpClient } from 'src/utils/httpClient';
import { IRecievedCompanyInfo, IUpdateCompanyInfo } from './companyInfoRepository';
import { IRecievedJobsite } from './jobsitesRepository';
import { IUpdatePosition, formatFromTo } from './positionsRepository';
import { IRecievedUser, IUpdateUser } from './usersRepository';

export interface Position {
  id: number;
  name: string;
  color: string;
  from: Moment;
  to: Moment;
}

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone_number: string;
  driver_amazon_id: string;
  roles: Role[];
}

export interface Role {
  id: number;
  name: string;
}

export const name = {
  Admin: 'admin',
  Owner: 'owner',
  SuperAdmin: 'super_admin',
  User: 'user',
} as const;

export interface IRecievedCompanies {
  id: number;
  name: string;
  address: string;
  driver_amount: number;
  fleat_size: number;
  payroll: string;
}

export interface IRecievedCompany {
  id: number;
  name: string;
  address: string;
  driver_amount: number;
  fleat_size: number;
  payroll: string;
  jobsites: any[];
  users: User[];
  positions: Position[];
}

export const recievedCompaniesMapper = (x: any): IRecievedCompanies => x;
export const recievedCompanyMapper = (x: any): IRecievedCompany => ({
  ...x,
  positions: x.positions.map((y: any) => formatFromTo(y)),
});

export const recievedCompanyInfoMapper = (x: any): IRecievedCompanyInfo => x;

export class CompaniesRepository {
  keys = {
    all: () => ['companies'],
    one: (id: number | string) => ['company', id],
    oneToken: (id: number | string) => ['company-token', id],
    companyInfoOne: (id: number | string) => ['companyInfo', id],
    companyInfoAll: () => ['companyInfo'],
  };

  getAll = async () => {
    const { data } = await httpClient.get<any[]>('super/companies');
    return data.map(recievedCompaniesMapper);
  };

  find = async (company_id: number | string) => {
    const { data } = await httpClient.get(`super/companies/${company_id}`);
    return recievedCompanyMapper(data);
  };

  findCompanyInfo = async (id: number) => {
    const { data } = await httpClient.get(`super/detail/companies/${id}`);
    return recievedCompanyInfoMapper(data);
  };

  update = async (company: IUpdateCompanyInfo) => httpClient.put(`super/companies`, company);

  delete = async (id: number) => httpClient.delete(`super/companies/${id}`);

  findJobsite = async (company_id: number | string) => {
    const { data } = await httpClient.get(`super/jobsites/${company_id}`);
    return data as IRecievedJobsite;
  };
  deleteJobsite = async (id: number) => httpClient.delete(`super/jobsites/${id}`);
  updateJobsite = async (company: IRecievedJobsite) =>
    httpClient.put(`super/jobsites/${company.id}`, company);

  deletePosition = async (id: number) => httpClient.delete(`super/positions/${id}`);
  updatePosition = async (company: IUpdatePosition) =>
    httpClient.put(`super/positions/${company.id}`, formatFromTo(company));

  findUser = async (company_id: number | string) => {
    const { data } = await httpClient.get(`super/users/${company_id}`);
    return data as IRecievedUser;
  };
  deleteUser = async (id: number) => httpClient.delete(`super/users/${id}`);
  updateUser = async (company: IUpdateUser) => httpClient.put(`super/users/${company.id}`, company);

  getCompanyToken = async (company_id: number) => {
    const { data } = await httpClient.get<{ token: string }>(`super/companies/${company_id}/token`);
    return data;
  };
}

const repo = new CompaniesRepository();

export const useAllCompaniesQuery = () =>
  useQuery({ queryKey: repo.keys.all(), queryFn: repo.getAll });

export const useInspectCompanyQuery = (company_id: number | string) =>
  useQuery({ queryKey: repo.keys.one(company_id), queryFn: () => repo.find(company_id) });

export const useSuperAdminCompanyInfoQuery = (id: number) =>
  useQuery({ queryKey: repo.keys.companyInfoOne(id), queryFn: () => repo.findCompanyInfo(id) });

export const useSuperAdminUpdateCompanyInfoMutation = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: repo.update,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.companyInfoAll());
      enqueueSnackbar('Company info updated', { variant: 'success' } as any);
      navigate(PATHS.superAdmin.root);
    },
  });
};

export const useSuperAdminDeleteCompanyMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.delete,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.all());
    },
  });
};

export const useSuperAdminGetJobsiteQuery = (company_id: number | string) =>
  useQuery({ queryKey: repo.keys.one(company_id), queryFn: () => repo.findJobsite(company_id) });

export const useSuperAdminUpdateJobsiteMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.updateJobsite,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.companyInfoAll());
      enqueueSnackbar('Jobsite updated', { variant: 'success' } as any);
    },
  });
};

export const useSuperAdminDeleteJobsiteMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.deleteJobsite,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.companyInfoAll());
    },
  });
};

export const useSuperAdminUpdatePositionMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.updatePosition,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.companyInfoAll());
    },
  });
};

export const useSuperAdminDeletePositionMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.deletePosition,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.companyInfoAll());
    },
  });
};

export const useSuperAdminGetUserQuery = (company_id: number | string) =>
  useQuery({ queryKey: repo.keys.one(company_id), queryFn: () => repo.findUser(company_id) });

export const useSuperAdminUpdateUserMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.updateUser,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.companyInfoAll());
    },
  });
};

export const useSuperAdminDeleteUserMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.deleteUser,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.companyInfoAll());
    },
  });
};

export const useSuperAdminGetCompanyTokenMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: repo.getCompanyToken,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.companyInfoAll());
    },
  });
};
