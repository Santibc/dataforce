import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpClient} from 'app/main/services/httpClient';

export interface IRecievedCoachingWeek {
  subject: string;
  year: number;
  week: number;
  category: string;
  content: string;
  user_id: number;
  type: 'coach' | 'congrats';
  read: boolean;
}

export const recievedCoachingWeekMapper = (x: any): IRecievedCoachingWeek => x;

export class CoachingWeekRepository {
  keys = {
    all: () => ['coaching'],
    one: (id: any) => ['coaching', id],
  };

  getAll = async ({week, year}: {week: number; year: number}) => {
    const data = await httpClient.get<any[]>(
      `user/coaching?week=${week}&year=${year}`,
    );
    return data;
  };

  seeMore = async (coaching_id: number | string) =>
    httpClient.post(`/user/coaching/${coaching_id}`);
}

const repo = new CoachingWeekRepository();

export const useAllCoachingWeeksQuery = ({
  week,
  year,
  enabled,
}: {
  week: number;
  year: number;
  enabled: boolean;
}) =>
  useQuery({
    queryKey: repo.keys.one({week, year}),
    queryFn: () => repo.getAll({week, year}),
    enabled: enabled,
  });

export const useSeeMoreReadMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.seeMore,
    onSuccess: () => {
      qc.invalidateQueries({queryKey: repo.keys.all()});
    },
  });
};
