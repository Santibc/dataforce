import type { QueryKey } from '@tanstack/query-core';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

export function useSuspenseQuery<
  TQueryFnData,
  TError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  arg1: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'enabled'>
): Omit<UseQueryResult<TData, TError>, 'data'> & { data: TData } {
  const query = useQuery({ ...arg1, suspense: true });
  return {
    ...query,
    data: query.data!,
  };
}
