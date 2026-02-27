import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { httpClient } from 'src/utils/httpClient';
import type { IChatGroup, IChatGroupDetail, IChatMessage, IUnreadCounts, ICreateChatGroup, IUpdateChatGroup } from './chatRepository';

// ────────────────────────────── Types ──────────────────────────────

export interface ISuperAdminOwner {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  company_name: string;
}

// Re-export the shared types
export type {
  IChatGroup,
  IChatGroupDetail,
  IChatMessage,
  IUnreadCounts,
  ICreateChatGroup,
  IUpdateChatGroup,
};

// ────────────────────────────── Repository ──────────────────────────────

export class SuperAdminChatRepository {
  keys = {
    groups: () => ['sa-chat-groups'],
    group: (id: number) => ['sa-chat-groups', id],
    messages: (groupId: number) => ['sa-chat-messages', groupId],
    unreadCounts: () => ['sa-chat-unread-counts'],
    owners: () => ['sa-chat-owners'],
  };

  getAllGroups = async () => {
    const { data } = await httpClient.get<IChatGroup[]>('super/chat-groups');
    return data;
  };

  getGroup = async (id: number) => {
    const { data } = await httpClient.get<IChatGroupDetail>(`super/chat-groups/${id}`);
    return data;
  };

  createGroup = async (payload: ICreateChatGroup) => {
    const { data } = await httpClient.post<IChatGroupDetail>('super/chat-groups', payload);
    return data;
  };

  updateGroup = async (payload: IUpdateChatGroup) => {
    const { data } = await httpClient.put<IChatGroupDetail>(
      `super/chat-groups/${payload.id}`,
      payload
    );
    return data;
  };

  deleteGroup = async (id: number, confirm?: boolean) =>
    httpClient.delete(`super/chat-groups/${id}`, { data: { confirm } });

  addMembers = async ({ groupId, member_ids }: { groupId: number; member_ids: number[] }) =>
    httpClient.post(`super/chat-groups/${groupId}/members`, { member_ids });

  removeMembers = async ({ groupId, member_ids }: { groupId: number; member_ids: number[] }) =>
    httpClient.delete(`super/chat-groups/${groupId}/members`, { data: { member_ids } });

  getMessages = async (groupId: number, afterId?: number) => {
    const params: Record<string, any> = {};
    if (afterId) params.after_id = afterId;
    const { data } = await httpClient.get<IChatMessage[]>(
      `super/chat-groups/${groupId}/messages`,
      { params }
    );
    return data;
  };

  sendMessage = async ({ groupId, body }: { groupId: number; body: string }) => {
    const { data } = await httpClient.post<IChatMessage>(
      `super/chat-groups/${groupId}/messages`,
      { body }
    );
    return data;
  };

  markAsRead = async (groupId: number) =>
    httpClient.put(`super/chat-groups/${groupId}/messages/read`);

  getUnreadCounts = async () => {
    const { data } = await httpClient.get<IUnreadCounts>('super/chat-groups/unread-counts');
    return data;
  };

  getOwners = async () => {
    const { data } = await httpClient.get<ISuperAdminOwner[]>('super/chat-groups/owners');
    return data;
  };
}

const repo = new SuperAdminChatRepository();

// ────────────────────────────── Query Hooks ──────────────────────────────

export const useSAAllChatGroupsQuery = () =>
  useQuery({
    queryKey: repo.keys.groups(),
    queryFn: repo.getAllGroups,
    refetchInterval: 10000,
  });

export const useSAChatGroupQuery = (id: number) =>
  useQuery({
    queryKey: repo.keys.group(id),
    queryFn: () => repo.getGroup(id),
    enabled: !!id,
  });

export const useSAChatMessagesQuery = (groupId: number, afterId?: number) =>
  useQuery({
    queryKey: [...repo.keys.messages(groupId), afterId],
    queryFn: () => repo.getMessages(groupId, afterId),
    enabled: !!groupId,
    refetchInterval: 5000,
  });

export const useSAUnreadCountsQuery = () =>
  useQuery({
    queryKey: repo.keys.unreadCounts(),
    queryFn: repo.getUnreadCounts,
    refetchInterval: 10000,
  });

export const useSAAllOwnersQuery = () =>
  useQuery({
    queryKey: repo.keys.owners(),
    queryFn: repo.getOwners,
  });

// ────────────────────────────── Mutation Hooks ──────────────────────────────

export const useSACreateChatGroupMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.createGroup,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.groups());
    },
  });
};

export const useSAUpdateChatGroupMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.updateGroup,
    onSuccess: (_, variables) => {
      qc.invalidateQueries(repo.keys.groups());
      qc.invalidateQueries(repo.keys.group(variables.id));
    },
  });
};

export const useSADeleteChatGroupMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, confirm }: { id: number; confirm?: boolean }) =>
      repo.deleteGroup(id, confirm),
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.groups());
    },
  });
};

export const useSAAddMembersMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.addMembers,
    onSuccess: (_, variables) => {
      qc.invalidateQueries(repo.keys.groups());
      qc.invalidateQueries(repo.keys.group(variables.groupId));
    },
  });
};

export const useSARemoveMembersMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.removeMembers,
    onSuccess: (_, variables) => {
      qc.invalidateQueries(repo.keys.groups());
      qc.invalidateQueries(repo.keys.group(variables.groupId));
    },
  });
};

export const useSASendMessageMutation = () => {
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

export const useSAMarkAsReadMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.markAsRead,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.unreadCounts());
      qc.invalidateQueries(repo.keys.groups());
    },
  });
};
