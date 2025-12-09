import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { httpClient } from 'src/utils/httpClient';

export interface IUpdateCompanyInfo {
  id: number;
  name: string;
  address: string;
  driver_amount: string;
  fleat_size: string;
  payroll: string;
}

export interface IRecievedCompanyInfo {
  id: number;
  name: string;
  address: string;
  driver_amount: string;
  fleat_size: string;
  payroll: string;
}

export const recievedCompanyInfoMapper = (x: any): IRecievedCompanyInfo => x;

export class CompanyInfoRepository {
  keys = {
    all: () => ['company-info'],
    one: (id: number) => ['company-info', id],
  };

  find = async (id: number) => {
    const { data } = await httpClient.get(`admin/companies/${id}`);
    return recievedCompanyInfoMapper(data);
  };

  update = async (company: IUpdateCompanyInfo) =>
    httpClient.put(`admin/companies/${company.id}`, company);
}

const repo = new CompanyInfoRepository();

export const useCompanyInfoQuery = (id: number) =>
  useQuery({ queryKey: repo.keys.one(id), queryFn: () => repo.find(id) });

export const useUpdateCompanyInfoMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.update,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.all());
      enqueueSnackbar('Company info updated', { variant: 'success' } as any);
    },
  });
};
