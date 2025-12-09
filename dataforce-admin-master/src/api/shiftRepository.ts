import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import { Moment } from 'moment';
import { httpClient } from 'src/utils/httpClient';

export interface ICreateShift {
  name: string;
  from: Moment;
  to: Moment;
  color: string;
  user_id: number;
  jobsite_id: number;
}

export interface IUpdateShift {
  id: number;
  name: string;
  from: Moment;
  to: Moment;
  color: string;
  user_id: number;
  jobsite_id: number;
}

export interface IRecievedShift {
  id: number;
  name: string;
  from: Moment;
  to: Moment;
  color: string;
  published: boolean;
  user_id: number;
  jobsite_id: number;
}

export const recievedShiftMapper = (x: any): IRecievedShift => ({
  ...x,
  from: moment.utc(x.from),
  to: moment.utc(x.to),
  published: x.published === 1
});

function formatFromTo<T extends ICreateShift>(data: T) {
  return {
    ...data,
    from: moment.utc(data.from),
    to: moment.utc(data.to),
  };
}

export interface ICopyShifts {
  jobsite_id: number;
  from: string;
  to: string;
  overwrite: boolean;
  weeks: number;
  user_id?: number;
  names?: string[]
}

export interface IPublishAll {
  jobsite_id: number;
  from: string;
  to: string;
  names?: string[];
  user_id?: number;
}

export interface IDeleteUserShifts {
  user_id: number;
  from: string;
  to: string;
  weeks: number;
  names?: string[];
}

export class ShiftRepository {
  keys = {
    all: () => ['shifts'],
    one: (id: number) => ['shifts', id],
  };

  getAll = async () => {
    const { data } = await httpClient.get<any[]>('admin/shifts');
    return data.map(recievedShiftMapper);
  };

  find = async (id: number) => {
    const { data } = await httpClient.get(`admin/shifts/${id}`);
    return recievedShiftMapper(data);
  };

  create = (shift: ICreateShift) => httpClient.post('admin/shifts', formatFromTo<ICreateShift>(shift));

  update = async (shift: IUpdateShift) => httpClient.put(`admin/shifts/${shift.id}`, formatFromTo<IUpdateShift>(shift));

  delete = async (id: number) => httpClient.delete(`admin/shifts/${id}`);

  deleteUserShifts = async (data: IDeleteUserShifts) => httpClient.delete(`admin/shifts/delete/user`, { data });

  publish = async (id: number) => httpClient.put(`admin/shifts/${id}/publish`)

  publishAll = async (data: IPublishAll) => httpClient.put('/admin/shifts/publish/all', data)
 
  copy = async (data: ICopyShifts) => {
    return httpClient.post(
      `admin/shifts/copy`, 
      {
        ...data, 
        from: moment(data.from).utc(),
        to: data.to
      }
    )
  }
}

const repo = new ShiftRepository();

export const useAllShiftsQuery = () =>
  useQuery({ queryKey: repo.keys.all(), queryFn: repo.getAll });

export const useCreateShiftMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.create,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.all());
      qc.invalidateQueries(['schedule-jobsite']);
    },
  });
};

export const useCopyShiftMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.copy,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.all());
      qc.invalidateQueries(['schedule-jobsite']);
    },
  });
};

export const useUpdateShiftMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.update,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.all());
      qc.invalidateQueries(['schedule-jobsite'])
    },
  });
};

export const useDeleteUserShiftMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.deleteUserShifts,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.all());
      qc.invalidateQueries(['schedule-jobsite'])
    },
  });
};

export const usePublishShiftMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.publish,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.all());
      qc.invalidateQueries(['schedule-jobsite'])
    },
  });
};

export const usePublishAllShiftMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.publishAll,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.all());
      qc.invalidateQueries(['schedule-jobsite'])
    },
  });
};

export const useDeleteShiftMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.delete,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.all());
      qc.invalidateQueries(['schedule-jobsite'])
    },
  });
};
