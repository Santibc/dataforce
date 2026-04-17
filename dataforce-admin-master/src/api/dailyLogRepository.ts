import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { httpClient } from 'src/utils/httpClient';

export interface IDailyLog {
  id: number;
  date: string;
  driver_id: number;
  driver_name: string;
  event_type: string;
  description: string | null;
  severity: string;
  action_taken: string | null;
  admin_id: number;
  admin_name: string;
  status: 'draft' | 'submitted';
  submitted_at: string | null;
  created_at: string | null;
}

export interface ICreateDailyLog {
  driver_id: number;
  event_type: string;
  description?: string;
  severity: string;
  action_taken?: string;
  status: 'draft' | 'submitted';
}

export interface IUpdateDailyLog {
  id: number;
  driver_id: number;
  event_type: string;
  description?: string;
  severity: string;
  action_taken?: string;
}

export class DailyLogRepository {
  keys = {
    all: () => ['daily-logs'],
    one: (id: number) => ['daily-logs', id],
  };

  getAll = async () => {
    const { data } = await httpClient.get<IDailyLog[]>('admin/daily-logs');
    return data;
  };

  create = async (payload: ICreateDailyLog) => {
    const { data } = await httpClient.post<IDailyLog>('admin/daily-logs', payload);
    return data;
  };

  update = async (payload: IUpdateDailyLog) => {
    const { data } = await httpClient.put<IDailyLog>(`admin/daily-logs/${payload.id}`, payload);
    return data;
  };

  submit = async (id: number) => {
    const { data } = await httpClient.put<IDailyLog>(`admin/daily-logs/${id}/submit`);
    return data;
  };

  delete = async (id: number) => httpClient.delete(`admin/daily-logs/${id}`);
}

const repo = new DailyLogRepository();

export const useAllDailyLogsQuery = () =>
  useQuery({
    queryKey: repo.keys.all(),
    queryFn: repo.getAll,
  });

export const useCreateDailyLogMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.create,
    onSuccess: () => {
      enqueueSnackbar('Daily log created', { variant: 'success' });
      qc.invalidateQueries(repo.keys.all());
    },
  });
};

export const useUpdateDailyLogMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.update,
    onSuccess: () => {
      enqueueSnackbar('Daily log updated', { variant: 'success' });
      qc.invalidateQueries(repo.keys.all());
    },
  });
};

export const useSubmitDailyLogMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.submit,
    onSuccess: () => {
      enqueueSnackbar('Daily log submitted and emails sent', { variant: 'success' });
      qc.invalidateQueries(repo.keys.all());
    },
    onError: () => {
      enqueueSnackbar('Failed to submit. Email could not be sent. Please try again.', {
        variant: 'error',
      });
    },
  });
};

export const useDeleteDailyLogMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.delete,
    onSuccess: () => {
      enqueueSnackbar('Daily log deleted', { variant: 'success' });
      qc.invalidateQueries(repo.keys.all());
    },
  });
};
