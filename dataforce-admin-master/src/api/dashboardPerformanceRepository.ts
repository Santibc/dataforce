import { useQuery } from '@tanstack/react-query';
import { DashboardPerformance } from 'src/models/Performance';
import { httpClient } from 'src/utils/httpClient';

export const recievedDashboardPerformanceMapper = (x: any): DashboardPerformance => x;

export class DashboardPerformanceRepository {
  keys = {
    all: () => ['dashboard-performance'],
    one: (id: number) => ['dashboard-performance', id],
  };

  getAll = async ({ week, year }: { week: number; year: number }) => {
    const { data } = await httpClient.get<any>(`admin/metrics?week=${week}&year=${year}`);
    return data as DashboardPerformance;
  };
}

const repo = new DashboardPerformanceRepository();

export const useAllDashboardPerformancesQuery = ({ week, year }: { week: number; year: number }) =>
  useQuery({
    queryKey: repo.keys.one(Number(`${week}${year}`)),
    queryFn: () => repo.getAll({ week, year }),
  });
