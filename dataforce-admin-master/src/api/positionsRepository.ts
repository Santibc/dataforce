import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import moment, { Moment } from 'moment';
import { httpClient } from 'src/utils/httpClient';

export interface ICreatePosition {
  name: string;
  from: Moment;
  to: Moment;
  color: string;
}

export interface IUpdatePosition {
  id: number;
  name: string;
  from: Moment;
  to: Moment;
  color: string;
}

export interface IRecievedPosition {
  id: number;
  name: string;
  from: Moment;
  to: Moment;
  color: string;
}

export const recievedPositionMapper = (x: any): IRecievedPosition => ({
  ...x,
  from: moment.utc(x.from),
  to: moment.utc(x.to),
});

export function formatFromTo<T extends ICreatePosition>(data: T) {
  return {
    ...data,
    from: moment.utc(data.from),
    to: moment.utc(data.to),
  };
}

export class PositionRepository {
  keys = {
    all: () => ['positions'],
    one: (id: number) => ['positions', id],
  };

  getAll = async () => {
    const { data } = await httpClient.get<any[]>('admin/positions');
    return data.map(recievedPositionMapper);
  };

  find = async (id: number) => {
    const { data } = await httpClient.get(`admin/positions/${id}`);
    return recievedPositionMapper(data);
  };

  create = (position: ICreatePosition) =>
    httpClient.post('admin/positions', formatFromTo<ICreatePosition>(position));

  update = async (position: IUpdatePosition) =>
    httpClient.put(`admin/positions/${position.id}`, formatFromTo<IUpdatePosition>(position));

  delete = async (id: number) => httpClient.delete(`admin/positions/${id}`);
}

const repo = new PositionRepository();

export const useAllPositionsQuery = () =>
  useQuery({ queryKey: repo.keys.all(), queryFn: repo.getAll });

export const useCreatePositionMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.create,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.all());
    },
  });
};

export const useUpdatePositionMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.update,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.all());
    },
  });
};

export const useDeletePositionMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.delete,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.all());
    },
  });
};
