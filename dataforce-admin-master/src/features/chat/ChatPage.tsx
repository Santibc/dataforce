import { Box, Card } from '@mui/material';
import { useState } from 'react';
import {
  IChatGroup,
  IChatGroupDetail,
  useChatGroupQuery,
  useChatMessagesQuery,
  useAllChatGroupsQuery,
} from 'src/api/chatRepository';
import { useAuthContext } from 'src/features/auth/useAuthContext';
import { ChatEmptyState } from './components/ChatEmptyState';
import { ChatGroupCreateDialog } from './components/ChatGroupCreateDialog';
import { ChatGroupDeleteDialog } from './components/ChatGroupDeleteDialog';
import { ChatGroupEditDialog } from './components/ChatGroupEditDialog';
import { ChatGroupMembersDialog } from './components/ChatGroupMembersDialog';
import { ChatSidebar } from './components/ChatSidebar';
import { ChatWindow } from './components/ChatWindow';

const ADMIN_ROLES = ['super_admin', 'admin', 'owner', 'manager'];

export function ChatPage() {
  const { roles } = useAuthContext();
  const isAdmin = (roles ?? []).some((r: string) => ADMIN_ROLES.includes(r));

  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  // Dialogs
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Queries
  const { data: groups = [], isLoading: groupsLoading } = useAllChatGroupsQuery();
  const { data: groupDetail } = useChatGroupQuery(selectedGroupId ?? 0);
  const { data: messages = [], isLoading: messagesLoading } = useChatMessagesQuery(
    selectedGroupId ?? 0
  );

  const selectedGroup = groups.find((g) => g.id === selectedGroupId) ?? null;

  const handleSelectGroup = (id: number) => {
    setSelectedGroupId(id);
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
        {/* Sidebar - Group List */}
        <ChatSidebar
          groups={groups}
          selectedGroupId={selectedGroupId}
          onSelectGroup={handleSelectGroup}
          onCreateGroup={() => setCreateOpen(true)}
          isAdmin={isAdmin}
          loading={groupsLoading}
        />

        {/* Main Chat Area */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedGroup ? (
            <ChatWindow
              group={selectedGroup}
              messages={messages}
              messagesLoading={messagesLoading}
              onEditGroup={() => setEditOpen(true)}
              onManageMembers={() => setMembersOpen(true)}
              onDeleteGroup={() => setDeleteOpen(true)}
              isAdmin={isAdmin}
            />
          ) : (
            <ChatEmptyState />
          )}
        </Box>
      </Card>

      {/* Dialogs */}
      <ChatGroupCreateDialog open={createOpen} onClose={() => setCreateOpen(false)} />

      <ChatGroupEditDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        group={selectedGroup}
      />

      <ChatGroupMembersDialog
        open={membersOpen}
        onClose={() => setMembersOpen(false)}
        group={groupDetail as IChatGroupDetail | null}
      />

      <ChatGroupDeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        group={selectedGroup}
        onDeleted={handleGroupDeleted}
      />
    </>
  );
}

export default ChatPage;
