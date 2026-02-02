import {useQuery} from '@tanstack/react-query';
import {httpClient} from 'app/main/services/httpClient';

export interface IRecievedWeekPerformance {
  id: number;
  fico_score: number | null;
  seatbelt_off_rate: number | null;
  speeding_event_ratio: number | null;
  distraction_rate: number | null;
  following_distance_rate: number | null;
  signal_violations_rate: number | null;
  overall_tier: string | null;
  cdf: number | null;
  dcr: number | null;
  pod: number | null;
  cc: number | null;
}

export const recievedWeekPerformanceMapper = (
  x: any,
): IRecievedWeekPerformance => x;

export class WeekPerformanceRepository {
  keys = {
    all: () => ['week-performance'],
    one: (id: any) => ['week-performance', id],
  };

  getAll = async ({
    user_id,
    week,
    year,
  }: {
    user_id: number;
    week: number;
    year: number;
  }) => {
    const data = await httpClient.get(
      `user/performance?user_id=${user_id}&week=${week}&year=${year}`,
    );
    return data as IRecievedWeekPerformance[];
  };
}

const repo = new WeekPerformanceRepository();

export const useAllWeekPerformancesQuery = ({
  user_id,
  week,
  year,
  enabled,
}: {
  user_id: number;
  week: number;
  year: number;
  enabled: boolean;
}) =>
  useQuery({
    queryKey: repo.keys.one({week, year}),
    queryFn: () => repo.getAll({user_id, week, year}),
    enabled: enabled,
  });
