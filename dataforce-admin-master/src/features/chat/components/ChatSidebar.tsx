import {
  Box,
  Button,
  Divider,
  InputAdornment,
  List,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import Iconify from 'src/components/iconify';
import { IChatGroup } from 'src/api/chatRepository';
import { ChatGroupItem } from './ChatGroupItem';

interface ChatSidebarProps {
  groups: IChatGroup[];
  selectedGroupId: number | null;
  onSelectGroup: (id: number) => void;
  onCreateGroup: () => void;
  isAdmin: boolean;
  loading?: boolean;
}

export function ChatSidebar({
  groups,
  selectedGroupId,
  onSelectGroup,
  onCreateGroup,
  isAdmin,
  loading,
}: ChatSidebarProps) {
  const [search, setSearch] = useState('');

  const filteredGroups = useMemo(() => {
    const sorted = [...groups].sort((a, b) => {
      const aTime = a.last_message?.created_at ?? a.created_at;
      const bTime = b.last_message?.created_at ?? b.created_at;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });

    if (!search.trim()) return sorted;
    const s = search.toLowerCase();
    return sorted.filter((g) => g.name.toLowerCase().includes(s));
  }, [groups, search]);

  return (
    <Stack
      sx={{
        width: 320,
        minWidth: 320,
        borderRight: '1px solid',
        borderColor: 'divider',
        height: '100%',
      }}
    >
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 2 }}>
        <Typography variant="h6">Chat</Typography>
        {isAdmin && (
          <Button
            variant="contained"
            size="small"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={onCreateGroup}
          >
            Create Group
          </Button>
        )}
      </Stack>

      {/* Search */}
      <Box sx={{ px: 2, pb: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search group..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Divider />

      {/* Groups List */}
      <List sx={{ flexGrow: 1, overflowY: 'auto', px: 1 }}>
        {loading && (
          <Typography variant="body2" color="text.disabled" sx={{ p: 2, textAlign: 'center' }}>
            Loading groups...
          </Typography>
        )}

        {!loading && filteredGroups.length === 0 && (
          <Typography variant="body2" color="text.disabled" sx={{ p: 2, textAlign: 'center' }}>
            {search ? 'No groups found' : 'No groups available'}
          </Typography>
        )}

        {filteredGroups.map((group) => (
          <ChatGroupItem
            key={group.id}
            group={group}
            selected={group.id === selectedGroupId}
            onClick={() => onSelectGroup(group.id)}
          />
        ))}
      </List>
    </Stack>
  );
}
