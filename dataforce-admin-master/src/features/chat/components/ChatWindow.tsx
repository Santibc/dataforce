import { Box, Chip, CircularProgress, IconButton, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import Iconify from 'src/components/iconify';
import {
  IChatGroup,
  IChatMessage,
  useMarkAsReadMutation,
  useSendMessageMutation,
} from 'src/api/chatRepository';
import { useAuthContext } from 'src/features/auth/useAuthContext';
import { ChatInput } from './ChatInput';
import { ChatMessageList } from './ChatMessageList';

const ADMIN_ROLES = ['super_admin', 'admin', 'owner', 'manager'];

interface ChatWindowProps {
  group: IChatGroup;
  messages: IChatMessage[];
  messagesLoading: boolean;
  onEditGroup: () => void;
  onManageMembers: () => void;
  onDeleteGroup: () => void;
  isAdmin: boolean;
}

export function ChatWindow({
  group,
  messages,
  messagesLoading,
  onEditGroup,
  onManageMembers,
  onDeleteGroup,
  isAdmin,
}: ChatWindowProps) {
  const { userId, roles } = useAuthContext();
  const sendMutation = useSendMessageMutation();
  const markReadMutation = useMarkAsReadMutation();

  const userIsAdmin = (roles ?? []).some((r: string) => ADMIN_ROLES.includes(r));
  const isSuperAdminGroup = group.is_super_admin_group === true;
  // In super admin groups, owners can write only if bidirectional (super_admin is the "admin" here)
  const canWrite = isSuperAdminGroup
    ? group.mode === 'bidirectional' || (roles ?? []).includes('super_admin')
    : group.mode === 'bidirectional' || userIsAdmin;
  // Owners can't manage super admin groups
  const showAdminButtons = isAdmin && !isSuperAdminGroup;

  // Mark as read when opening
  useEffect(() => {
    if (group.id && group.unread_count > 0) {
      markReadMutation.mutate(group.id);
    }
  }, [group.id]);

  const handleSend = (body: string) => {
    sendMutation.mutate({ groupId: group.id, body });
  };

  return (
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
              {group.name}
            </Typography>
            {isSuperAdminGroup && (
              <Chip
                label="BosMetrics"
                size="small"
                color="secondary"
                sx={{ height: 20, fontSize: 11, fontWeight: 'bold' }}
              />
            )}
            <Chip
              label={group.type === 'global' ? 'Global' : 'Custom'}
              size="small"
              color={group.type === 'global' ? 'primary' : 'info'}
              variant="outlined"
              sx={{ height: 20, fontSize: 11 }}
            />
            <Chip
              label={group.mode === 'bidirectional' ? 'Bidirectional' : 'Unilateral'}
              size="small"
              color={group.mode === 'bidirectional' ? 'success' : 'warning'}
              variant="outlined"
              sx={{ height: 20, fontSize: 11 }}
            />
          </Stack>
          <Typography variant="caption" color="text.secondary">
            {group.members_count} members
          </Typography>
        </Box>

        {showAdminButtons && (
          <Stack direction="row" spacing={0.5}>
            <IconButton size="small" onClick={onManageMembers} title="Manage members">
              <Iconify icon="eva:people-outline" />
            </IconButton>
            <IconButton size="small" onClick={onEditGroup} title="Edit group">
              <Iconify icon="eva:edit-2-outline" />
            </IconButton>
            <IconButton size="small" onClick={onDeleteGroup} title="Delete group" color="error">
              <Iconify icon="eva:trash-2-outline" />
            </IconButton>
          </Stack>
        )}
      </Stack>

      {/* Messages */}
      {messagesLoading && messages.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
          <CircularProgress />
        </Box>
      ) : (
        <ChatMessageList messages={messages} currentUserId={userId} />
      )}

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        disabled={!canWrite}
        loading={sendMutation.isLoading}
      />
    </Stack>
  );
}
