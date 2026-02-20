import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { httpClient } from 'src/utils/httpClient';

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

export interface IChatGroupDetail extends IChatGroup {
  members: IChatGroupMember[];
  created_by: { id: number; firstname: string; lastname: string } | null;
}

export interface IChatGroupMember {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  roles: string[];
}

export interface IChatMessage {
  id: number;
  body: string;
  sender: IChatGroupSender;
  chat_group_id: number;
  created_at: string;
}

export interface ICreateChatGroup {
  name: string;
  type: 'custom' | 'global';
  mode: 'bidirectional' | 'unilateral';
  auto_add_new_members: boolean;
  show_history_to_new_members: boolean;
  member_ids?: number[];
}

export interface IUpdateChatGroup {
  id: number;
  name: string;
  mode: 'bidirectional' | 'unilateral';
  auto_add_new_members: boolean;
  show_history_to_new_members: boolean;
}

export interface IUnreadCounts {
  total_unread: number;
  groups: { chat_group_id: number; unread_count: number }[];
}

// ────────────────────────────── Repository ──────────────────────────────

export class ChatRepository {
  keys = {
    groups: () => ['chat-groups'],
    group: (id: number) => ['chat-groups', id],
    messages: (groupId: number) => ['chat-messages', groupId],
    unreadCounts: () => ['chat-unread-counts'],
  };

  getAllGroups = async () => {
    const { data } = await httpClient.get<IChatGroup[]>('admin/chat-groups');
    return data;
  };

  getGroup = async (id: number) => {
    const { data } = await httpClient.get<IChatGroupDetail>(`admin/chat-groups/${id}`);
    return data;
  };

  createGroup = async (payload: ICreateChatGroup) => {
    const { data } = await httpClient.post<IChatGroupDetail>('admin/chat-groups', payload);
    return data;
  };

  updateGroup = async (payload: IUpdateChatGroup) => {
    const { data } = await httpClient.put<IChatGroupDetail>(
      `admin/chat-groups/${payload.id}`,
      payload
    );
    return data;
  };

  deleteGroup = async (id: number, confirm?: boolean) =>
    httpClient.delete(`admin/chat-groups/${id}`, { data: { confirm } });

  addMembers = async ({ groupId, member_ids }: { groupId: number; member_ids: number[] }) =>
    httpClient.post(`admin/chat-groups/${groupId}/members`, { member_ids });

  removeMembers = async ({ groupId, member_ids }: { groupId: number; member_ids: number[] }) =>
    httpClient.delete(`admin/chat-groups/${groupId}/members`, { data: { member_ids } });

  getMessages = async (groupId: number, afterId?: number) => {
    const params: Record<string, any> = {};
    if (afterId) params.after_id = afterId;
    const { data } = await httpClient.get<IChatMessage[]>(
      `admin/chat-groups/${groupId}/messages`,
      { params }
    );
    return data;
  };

  sendMessage = async ({ groupId, body }: { groupId: number; body: string }) => {
    const { data } = await httpClient.post<IChatMessage>(
      `admin/chat-groups/${groupId}/messages`,
      { body }
    );
    return data;
  };

  markAsRead = async (groupId: number) =>
    httpClient.put(`admin/chat-groups/${groupId}/messages/read`);

  getUnreadCounts = async () => {
    const { data } = await httpClient.get<IUnreadCounts>('admin/chat-groups/unread-counts');
    return data;
  };
}

const repo = new ChatRepository();

// ────────────────────────────── Query Hooks ──────────────────────────────

export const useAllChatGroupsQuery = () =>
  useQuery({
    queryKey: repo.keys.groups(),
    queryFn: repo.getAllGroups,
    refetchInterval: 10000,
  });

export const useChatGroupQuery = (id: number) =>
  useQuery({
    queryKey: repo.keys.group(id),
    queryFn: () => repo.getGroup(id),
    enabled: !!id,
  });

export const useChatMessagesQuery = (groupId: number, afterId?: number) =>
  useQuery({
    queryKey: [...repo.keys.messages(groupId), afterId],
    queryFn: () => repo.getMessages(groupId, afterId),
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

export const useCreateChatGroupMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.createGroup,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.groups());
    },
  });
};

export const useUpdateChatGroupMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.updateGroup,
    onSuccess: (_, variables) => {
      qc.invalidateQueries(repo.keys.groups());
      qc.invalidateQueries(repo.keys.group(variables.id));
    },
  });
};

export const useDeleteChatGroupMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, confirm }: { id: number; confirm?: boolean }) =>
      repo.deleteGroup(id, confirm),
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.groups());
    },
  });
};

export const useAddMembersMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.addMembers,
    onSuccess: (_, variables) => {
      qc.invalidateQueries(repo.keys.groups());
      qc.invalidateQueries(repo.keys.group(variables.groupId));
    },
  });
};

export const useRemoveMembersMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.removeMembers,
    onSuccess: (_, variables) => {
      qc.invalidateQueries(repo.keys.groups());
      qc.invalidateQueries(repo.keys.group(variables.groupId));
    },
  });
};

export const useSendMessageMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.sendMessage,
    onSuccess: (_, variables) => {
      qc.invalidateQueries(repo.keys.messages(variables.groupId));
      qc.invalidateQueries(repo.keys.unreadCounts());
      qc.invalidateQueries(repo.keys.groups());
    },
  });
};

export const useMarkAsReadMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.markAsRead,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.unreadCounts());
      qc.invalidateQueries(repo.keys.groups());
    },
  });
};
