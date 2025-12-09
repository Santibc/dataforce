import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { httpClient } from 'src/utils/httpClient';

export interface ICreateOnboardingRepository {
  firstname: string;
  lastname: string;
  address: string;
  email: string;
  payroll: string;
  phone_number: string;
  name: string;
  fleat_size: string;
  driver_amount: string;
}

export class OnboardingRepositoryRepository {
  keys = {
    all: () => ['onboarding'],
    one: (id: number) => ['onboarding', id],
  };

  create = (jobsite: ICreateOnboardingRepository) =>
    httpClient.post('admin/companies/register', jobsite);
}

const repo = new OnboardingRepositoryRepository();

export const useCreateOnboardingRepositoryMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.create,
    onSuccess: () => {
      enqueueSnackbar('Onboarding successful!', { variant: 'success' });
    },
  });
};
