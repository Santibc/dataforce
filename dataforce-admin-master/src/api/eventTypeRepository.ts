import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { httpClient } from 'src/utils/httpClient';

export interface IEventType {
  id: number;
  name: string;
  slug: string;
  default_severity: string | null;
  default_description: string | null;
  default_action_taken: string | null;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface ICreateEventType {
  name: string;
  default_severity?: string | null;
  default_description?: string | null;
  default_action_taken?: string | null;
  is_active?: boolean;
}

export interface IUpdateEventType extends ICreateEventType {
  id: number;
}

export class EventTypeRepository {
  keys = {
    all: (includeInactive = false) => ['event-types', { includeInactive }],
  };

  getAll = async (includeInactive = false) => {
    const { data } = await httpClient.get<IEventType[]>('admin/event-types', {
      params: includeInactive ? { include_inactive: 1 } : undefined,
    });
    return data;
  };

  create = async (payload: ICreateEventType) => {
    const { data } = await httpClient.post<IEventType>('admin/event-types', payload);
    return data;
  };

  update = async (payload: IUpdateEventType) => {
    const { id, ...rest } = payload;
    const { data } = await httpClient.put<IEventType>(`admin/event-types/${id}`, rest);
    return data;
  };

  delete = async (id: number) => httpClient.delete(`admin/event-types/${id}`);
}

const repo = new EventTypeRepository();

export const useAllEventTypesQuery = (includeInactive = false) =>
  useQuery({
    queryKey: repo.keys.all(includeInactive),
    queryFn: () => repo.getAll(includeInactive),
  });

const invalidate = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries(['event-types']);
};

export const useCreateEventTypeMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.create,
    onSuccess: () => {
      enqueueSnackbar('Event type created', { variant: 'success' });
      invalidate(qc);
    },
  });
};

export const useUpdateEventTypeMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.update,
    onSuccess: () => {
      enqueueSnackbar('Event type updated', { variant: 'success' });
      invalidate(qc);
    },
  });
};

export const useDeleteEventTypeMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.delete,
    onSuccess: () => {
      enqueueSnackbar('Event type deleted', { variant: 'success' });
      invalidate(qc);
    },
  });
};
