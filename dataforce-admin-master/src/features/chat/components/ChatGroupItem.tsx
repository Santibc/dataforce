import { Avatar, Badge, Box, Chip, ListItemButton, Stack, Typography } from '@mui/material';
import Iconify from 'src/components/iconify';
import { IChatGroup } from 'src/api/chatRepository';

interface ChatGroupItemProps {
  group: IChatGroup;
  selected: boolean;
  onClick: () => void;
}

export function ChatGroupItem({ group, selected, onClick }: ChatGroupItemProps) {
  const lastMsg = group.last_message;

  return (
    <ListItemButton
      onClick={onClick}
      selected={selected}
      sx={{
        px: 2,
        py: 1.5,
        borderRadius: 1,
        '&.Mui-selected': {
          bgcolor: 'action.selected',
        },
      }}
    >
      <Badge
        badgeContent={group.unread_count}
        color="error"
        sx={{ mr: 2 }}
      >
        <Avatar sx={{ bgcolor: group.type === 'global' ? 'primary.main' : 'info.main' }}>
          <Iconify
            icon={group.type === 'global' ? 'eva:globe-2-outline' : 'eva:people-outline'}
            width={20}
          />
        </Avatar>
      </Badge>

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Typography variant="subtitle2" noWrap sx={{ flexGrow: 1 }}>
            {group.name}
          </Typography>
          {group.mode === 'unilateral' && (
            <Iconify icon="eva:lock-outline" width={14} sx={{ color: 'text.disabled' }} />
          )}
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Typography variant="body2" color="text.secondary" noWrap sx={{ flexGrow: 1 }}>
            {lastMsg ? lastMsg.body : 'No messages'}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
          {group.is_super_admin_group && (
            <Chip
              label="BosMetrics"
              size="small"
              color="secondary"
              sx={{ height: 18, fontSize: 10, fontWeight: 'bold' }}
            />
          )}
          <Chip
            label={group.type === 'global' ? 'Global' : 'Custom'}
            size="small"
            variant="outlined"
            sx={{ height: 18, fontSize: 10 }}
          />
          <Typography variant="caption" color="text.disabled">
            {group.members_count} members
          </Typography>
        </Stack>
      </Box>
    </ListItemButton>
  );
}
