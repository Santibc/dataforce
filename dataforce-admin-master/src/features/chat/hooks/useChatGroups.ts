import { useAllChatGroupsQuery } from 'src/api/chatRepository';

export function useChatGroups() {
  const { data: groups = [], isLoading, error } = useAllChatGroupsQuery();

  return {
    groups,
    isLoading,
    error,
  };
}
