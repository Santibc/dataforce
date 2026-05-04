import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { httpClient } from 'app/main/services/httpClient';

// ────────────────────────────── Types ──────────────────────────────

export interface IChatGroupSender {
  id: number;
  firstname: string;
  lastname: string;
  role: string;
}

export interface IChatLastMessage {
  id: number;
  body: string;
  sender_name: string;
  created_at: string;
}

export interface IChatGroup {
  id: number;
  name: string;
  type: 'custom' | 'global';
  mode: 'bidirectional' | 'unilateral';
  auto_add_new_members: boolean;
  show_history_to_new_members: boolean;
  members_count: number;
  last_message: IChatLastMessage | null;
  unread_count: number;
  created_at: string;
}

export type ChatAttachmentKind = 'image' | 'document';

export interface IChatAttachment {
  url: string;
  name: string;
  file_name?: string;
  mime_type: string;
  size: number;
  kind: ChatAttachmentKind;
}

export interface IChatMessage {
  id: number;
  body: string | null;
  sender: IChatGroupSender;
  chat_group_id: number;
  created_at: string;
  attachment: IChatAttachment | null;
}

export interface IAttachmentInput {
  uri: string;
  name: string;
  mime_type: string;
  size?: number;
}

export interface IUnreadCounts {
  total_unread: number;
  groups: { chat_group_id: number; unread_count: number }[];
}

// ────────────────────────────── Repository ──────────────────────────────

export class ChatRepository {
  keys = {
    groups: () => ['chat-groups'],
    messages: (groupId: number) => ['chat-messages', groupId],
    unreadCounts: () => ['chat-unread-counts'],
  };

  getAllGroups = async () =>
    httpClient.get<IChatGroup[]>('user/chat-groups');

  getMessages = async (groupId: number, afterId?: number) => {
    const params = afterId ? `?after_id=${afterId}` : '';
    return httpClient.get<IChatMessage[]>(
      `user/chat-groups/${groupId}/messages${params}`,
    );
  };

  sendMessage = async (
    groupId: number,
    payload: { body?: string | null; attachment?: IAttachmentInput | null },
  ) => {
    const fd = new FormData();
    if (payload.body && payload.body.trim() !== '') {
      fd.append('body', payload.body);
    }
    if (payload.attachment) {
      fd.append('attachment', {
        uri: payload.attachment.uri,
        name: payload.attachment.name,
        type: payload.attachment.mime_type,
      } as any);
    }
    return httpClient.post<IChatMessage>(
      `user/chat-groups/${groupId}/messages`,
      fd,
    );
  };

  markAsRead = async (groupId: number) =>
    httpClient.put(`user/chat-groups/${groupId}/messages/read`);

  getUnreadCounts = async () =>
    httpClient.get<IUnreadCounts>('user/chat-groups/unread-counts');
}

const repo = new ChatRepository();

// ────────────────────────────── Query Hooks ──────────────────────────────

export const useAllChatGroupsQuery = () =>
  useQuery({
    queryKey: repo.keys.groups(),
    queryFn: repo.getAllGroups,
    refetchInterval: 10000,
  });

export const useChatMessagesQuery = (groupId: number) =>
  useQuery({
    queryKey: repo.keys.messages(groupId),
    queryFn: () => repo.getMessages(groupId),
    enabled: !!groupId,
    refetchInterval: 5000,
  });

export const useUnreadCountsQuery = () =>
  useQuery({
    queryKey: repo.keys.unreadCounts(),
    queryFn: repo.getUnreadCounts,
    refetchInterval: 10000,
  });

// ────────────────────────────── Mutation Hooks ──────────────────────────────

interface SendMessageVars {
  groupId: number;
  body?: string | null;
  attachment?: IAttachmentInput | null;
}

export const useSendMessageMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, body, attachment }: SendMessageVars) =>
      repo.sendMessage(groupId, { body, attachment }),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: repo.keys.messages(variables.groupId) });
      qc.invalidateQueries({ queryKey: repo.keys.unreadCounts() });
      qc.invalidateQueries({ queryKey: repo.keys.groups() });
    },
  });
};

export const useMarkAsReadMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (groupId: number) => repo.markAsRead(groupId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: repo.keys.unreadCounts() });
      qc.invalidateQueries({ queryKey: repo.keys.groups() });
    },
  });
};
