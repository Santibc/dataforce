import { useQuery } from '@tanstack/react-query';
import { LastWeekPerformance } from 'src/models/Performance';
import { httpClient } from 'src/utils/httpClient';

export const recievedSeederPerformanceMapper = (x: any): LastWeekPerformance => ({
  ...x,
  user_id: x.user.id,
  user_name: x.user.name,
});

export class SeederPerformanceRepository {
  keys = {
    all: () => ['performance'],
  };

  getAll = async () => {
    const { data } = await httpClient.get<any[]>('admin/performance');
    return data.map(recievedSeederPerformanceMapper);
  };
}

const repo = new SeederPerformanceRepository();

export const useAllSeederPerformancesQuery = () =>
  useQuery({ queryKey: repo.keys.all(), queryFn: repo.getAll });
