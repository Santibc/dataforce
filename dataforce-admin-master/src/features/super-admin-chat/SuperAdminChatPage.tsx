import { Box, Card, Chip, CircularProgress, IconButton, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import {
  IChatGroupDetail,
  useSAAllChatGroupsQuery,
  useSAChatGroupQuery,
  useSAChatMessagesQuery,
  useSASendMessageMutation,
  useSAMarkAsReadMutation,
  useSAUpdateChatGroupMutation,
  useSADeleteChatGroupMutation,
} from 'src/api/superAdminChatRepository';
import type { IChatGroup } from 'src/api/chatRepository';
import { useAuthContext } from 'src/features/auth/useAuthContext';
import Iconify from 'src/components/iconify';
import { ChatEmptyState } from 'src/features/chat/components/ChatEmptyState';
import { ChatInput } from 'src/features/chat/components/ChatInput';
import { ChatMessageList } from 'src/features/chat/components/ChatMessageList';
import { ChatSidebar } from 'src/features/chat/components/ChatSidebar';
import { SuperAdminChatGroupCreateDialog } from './components/SuperAdminChatGroupCreateDialog';
import { SuperAdminChatGroupMembersDialog } from './components/SuperAdminChatGroupMembersDialog';
import { SuperAdminChatGroupEditDialog } from './components/SuperAdminChatGroupEditDialog';
import { SuperAdminChatGroupDeleteDialog } from './components/SuperAdminChatGroupDeleteDialog';

export function SuperAdminChatPage() {
  const { userId } = useAuthContext();

  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  // Dialogs
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Queries
  const { data: groups = [], isLoading: groupsLoading } = useSAAllChatGroupsQuery();
  const { data: groupDetail } = useSAChatGroupQuery(selectedGroupId ?? 0);
  const { data: messages = [], isLoading: messagesLoading } = useSAChatMessagesQuery(
    selectedGroupId ?? 0
  );

  // Mutations
  const sendMutation = useSASendMessageMutation();
  const markReadMutation = useSAMarkAsReadMutation();

  const selectedGroup = groups.find((g) => g.id === selectedGroupId) ?? null;

  // Mark as read when opening a group
  useEffect(() => {
    if (selectedGroupId && selectedGroup && selectedGroup.unread_count > 0) {
      markReadMutation.mutate(selectedGroupId);
    }
  }, [selectedGroupId]);

  const handleSend = (body: string) => {
    if (!selectedGroupId) return;
    sendMutation.mutate({ groupId: selectedGroupId, body });
  };

  const handleGroupDeleted = () => {
    setSelectedGroupId(null);
  };

  return (
    <>
      <Card
        sx={{
          display: 'flex',
          height: 'calc(100vh - 140px)',
          overflow: 'hidden',
        }}
      >
        {/* Sidebar */}
        <ChatSidebar
          groups={groups}
          selectedGroupId={selectedGroupId}
          onSelectGroup={(id) => setSelectedGroupId(id)}
          onCreateGroup={() => setCreateOpen(true)}
          isAdmin
          loading={groupsLoading}
        />

        {/* Main Chat Area */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedGroup ? (
            <Stack sx={{ flexGrow: 1, height: '100%' }}>
              {/* Header */}
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  px: 2,
                  py: 1.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  minHeight: 56,
                }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {selectedGroup.name}
                    </Typography>
                    <Chip
                      label={selectedGroup.type === 'global' ? 'Global' : 'Custom'}
                      size="small"
                      color={selectedGroup.type === 'global' ? 'primary' : 'info'}
                      variant="outlined"
                      sx={{ height: 20, fontSize: 11 }}
                    />
                    <Chip
                      label={
                        selectedGroup.mode === 'bidirectional' ? 'Bidirectional' : 'Unilateral'
                      }
                      size="small"
                      color={selectedGroup.mode === 'bidirectional' ? 'success' : 'warning'}
                      variant="outlined"
                      sx={{ height: 20, fontSize: 11 }}
                    />
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    {selectedGroup.members_count} members
                  </Typography>
                </Box>

                <Stack direction="row" spacing={0.5}>
                  <IconButton
                    size="small"
                    onClick={() => setMembersOpen(true)}
                    title="Manage members"
                  >
                    <Iconify icon="eva:people-outline" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => setEditOpen(true)}
                    title="Edit group"
                  >
                    <Iconify icon="eva:edit-2-outline" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => setDeleteOpen(true)}
                    title="Delete group"
                    color="error"
                  >
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Stack>
              </Stack>

              {/* Messages */}
              {messagesLoading && messages.length === 0 ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexGrow: 1,
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <ChatMessageList messages={messages} currentUserId={userId} />
              )}

              {/* Input - super admin can always write */}
              <ChatInput
                onSend={handleSend}
                disabled={false}
                loading={sendMutation.isLoading}
              />
            </Stack>
          ) : (
            <ChatEmptyState />
          )}
        </Box>
      </Card>

      {/* Dialogs */}
      <SuperAdminChatGroupCreateDialog open={createOpen} onClose={() => setCreateOpen(false)} />

      <SuperAdminChatGroupEditDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        group={selectedGroup}
      />

      <SuperAdminChatGroupMembersDialog
        open={membersOpen}
        onClose={() => setMembersOpen(false)}
        group={groupDetail as IChatGroupDetail | null}
      />

      <SuperAdminChatGroupDeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        group={selectedGroup}
        onDeleted={handleGroupDeleted}
      />
    </>
  );
}

export default SuperAdminChatPage;
