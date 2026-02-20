import { useChatMessagesQuery } from 'src/api/chatRepository';

export function useChatMessages(groupId: number | null) {
  const { data: messages = [], isLoading, error } = useChatMessagesQuery(groupId ?? 0);

  return {
    messages,
    isLoading,
    error,
  };
}
