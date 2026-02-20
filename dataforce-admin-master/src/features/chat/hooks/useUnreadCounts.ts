import { useUnreadCountsQuery } from 'src/api/chatRepository';

export function useUnreadCounts() {
  const { data, isLoading } = useUnreadCountsQuery();

  return {
    totalUnread: data?.total_unread ?? 0,
    groupCounts: data?.groups ?? [],
    isLoading,
  };
}
