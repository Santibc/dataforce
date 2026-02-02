import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { httpClient } from 'app/main/services/httpClient';

export interface IRecievedScheduleSemanal {
  color: string;
  from: string;
  id: number;
  name: string;
  to: string;
  published: boolean;
  confirmed: boolean;
  jobsite: {
    address_number: string;
    address_street: string;
    city: string;
    id: number;
    name: string;
    state: string;
    zip_code: string;
  };
}

export const recievedScheduleSemanalMapper = (
  x: any,
): IRecievedScheduleSemanal => x;

export class ScheduleSemanalRepository {
  keys = {
    all: () => ['schedulesemanal'],
    allByDate: ({from, to}: {from:string, to:string}) => ['schedulesemanal', {from, to}],
    one: (id: number) => ['schedulesemanal', id],
  };

  getAll = async ({from, to}: {from: string; to: string}) => {
    const data = await httpClient.get<any[]>(
      `user/schedule?from=${from}&to=${to}`,
    );
    return data.map(recievedScheduleSemanalMapper);
  };

  confirmWeek = async ({from, to}: {from: string; to: string}) =>
    httpClient.post(`user/shifts/confirm?from=${from}&to=${to}`);

  /*   find = async (id: number) => {
  const { data } = await httpClient.get(`admin/schedulesemanal/${id}`);
  return recievedScheduleSemanalMapper(data);
  };

  create = (jobsite: ICreateScheduleSemanal) => httpClient.post('admin/schedulesemanal', jobsite);

  update = async (jobsite: IUpdateScheduleSemanal) =>
  httpClient.put(`admin/schedulesemanal/${jobsite.id}`, jobsite);

  delete = async (id: number) => httpClient.delete(`admin/schedulesemanal/${id}`); */
}

const repo = new ScheduleSemanalRepository();

export const useAllScheduleSemanalsQuery = ({
  from,
  to,
}: {
  from: string;
  to: string;
}) =>
  useQuery({queryKey: repo.keys.allByDate({from, to}), queryFn: () => repo.getAll({from, to})});

export const useConfirmWeekUserScheduleMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.confirmWeek,
    onSuccess: () => {
      qc.invalidateQueries({queryKey: repo.keys.all()});
    },
  });
};

/* export const useCreateScheduleSemanalMutation = () => {
  const qc = useQueryClient();
  return useMutation({
  mutationFn: repo.create,
  onSuccess: () => {
    qc.invalidateQueries(repo.keys.all());
  },
  });
};

export const useUpdateScheduleSemanalMutation = () => {
  const qc = useQueryClient();
  return useMutation({
  mutationFn: repo.update,
  onSuccess: () => {
    qc.invalidateQueries(repo.keys.all());
  },
  });
};

export const useDeleteScheduleSemanalMutation = () => {
  const qc = useQueryClient();
  return useMutation({
  mutationFn: repo.delete,
  onSuccess: () => {
    qc.invalidateQueries(repo.keys.all());
  },
  });
}; */
