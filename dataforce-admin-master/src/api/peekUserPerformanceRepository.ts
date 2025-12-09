import { useQuery } from '@tanstack/react-query';
import { PeekUserPerformance } from 'src/models/Performance';
import { httpClient } from 'src/utils/httpClient';

export const recievedPeekUserPerformanceMapper = (x: any): PeekUserPerformance => x;

export class PeekUserPerformanceRepository {
  keys = {
    all: () => ['peek-performance'],
    one: (id: number) => ['peek-performance', id],
  };

  find = async (id: number) => {
    const { data } = await httpClient.get(`admin/performance/${id}`);
    return recievedPeekUserPerformanceMapper(data);
  };
}

const repo = new PeekUserPerformanceRepository();

export const useAllPeekUserPerformancesQuery = ({ user_id }: { user_id: number }) =>
  useQuery({ queryKey: repo.keys.one(user_id), queryFn: () => repo.find(user_id) });
