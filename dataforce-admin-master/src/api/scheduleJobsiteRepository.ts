import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import moment, { Moment } from 'moment';
import { httpClient } from 'src/utils/httpClient';

export interface ScheduleShift {
  id: number;
  name: string;
  color: string;
  published: boolean;
  delete_after_published: boolean;
  from: Moment;
  to: Moment;
  confirmed: boolean;
}

export interface ScheduleShiftForDelete {
  id: number;
  name: string;
  color: string;
  published: boolean;
  delete_after_published: boolean;
  from: Moment;
  to: Moment;
  user: {
    name: string;
    id: number;
  };
}

export interface IRecievedScheduleJobsite {
  cantidad_horas: number;
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  preferences: {
    id: number,
    available: boolean;
    date: Moment
  }[];
  phone_number: string;
  driver_amazon_id: string;
  company_id: number;
  shifts: ScheduleShift[];
}

export const recievedScheduleJobsiteMapper = (x: any): IRecievedScheduleJobsite => ({
    ...x,
    preferences: x.preferences.map((z: any) => ({
        ...z,
        date: moment.utc(z.date)
      })),
    shifts: x.shifts.map((y: any) => ({
        ...y,
        from: moment.utc(y.from),
        to: moment.utc(y.to),
        published: y.published === 1
      }))
  });

export class ScheduleJobsiteRepository {
  keys = {
    all: () => ['schedule-jobsite'],
    one: (id: string) => ['schedule-jobsite', id],
  };

  getAll = async ({
    jobsite_id,
    from_datetime,
    to_datetime,
    name_positions,
    users_id,
  }: {
    jobsite_id: string;
    from_datetime: string;
    to_datetime: string;
    name_positions?: string[];
    users_id?: string;
  }) => {
    const { data } = await httpClient.get<any[]>(
      `admin/schedule?jobsite_id=${jobsite_id}&from=${from_datetime}&to=${to_datetime}${
        name_positions
          ? name_positions
              .filter((name) => name !== 'All')
              .map((name) => `&name_positions[]=${name}`)
              .join('')
          : ''
      }${users_id ? `&users_id[]=${users_id}` : ''}`
    );
    return data.map(recievedScheduleJobsiteMapper);
  };


  clean = async ({
    jobsite_id,
    from_datetime,
    to_datetime,
    name_positions,
  } : {
    jobsite_id: number;
    from_datetime: string;
    to_datetime: string;
    name_positions?: string[];
  }) => {
    const data = {
      from: from_datetime,
      to: to_datetime,
      name_positions: name_positions ? name_positions : undefined,
      jobsite_id
    }
    await httpClient.delete<any[]>(`admin/schedule/clean`, { data });
  }
  /* 
  find = async (id: number) => {
    const { data } = await httpClient.get(`admin/schedule-jobsite/${id}`);
    return recievedScheduleJobsiteMapper(data);
  };

  create = (jobsite: ICreateScheduleJobsite) => httpClient.post('admin/schedule-jobsite', jobsite);

  update = async (jobsite: IUpdateScheduleJobsite) =>
    httpClient.put(`admin/schedule-jobsite/${jobsite.id}`, jobsite);

  delete = async (id: number) => httpClient.delete(`admin/schedule-jobsite/${id}`); */
}

const repo = new ScheduleJobsiteRepository();

export const useAllScheduleJobsitesQuery = ({
  jobsite_id,
  from_datetime,
  to_datetime,
  name_positions,
  users_id,
}: {
  jobsite_id: string;
  from_datetime: string;
  to_datetime: string;
  name_positions?: string[];
  users_id?: string;
}) =>
  useQuery({
    queryKey: repo.keys.one(
      `${jobsite_id}-${from_datetime}-${to_datetime}-${name_positions}-${users_id}`
    ),
    queryFn: () =>
      repo.getAll({ jobsite_id, from_datetime, to_datetime, name_positions, users_id }),
    select: (data) => {
      // Sort data by firstname first and then by lastname
      data.sort((a, b) => a.firstname.localeCompare(b.firstname))
      return data
    },
  });

/* export const useCreateScheduleJobsiteMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.create,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.all());
    },
  });
};

export const useUpdateScheduleJobsiteMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.update,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.all());
    },
  });
};

export const useDeleteScheduleJobsiteMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.delete,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.all());
    },
  });
};
 */

export const useCleancheduleJobsiteMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.clean,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.all());
    },
  });
};