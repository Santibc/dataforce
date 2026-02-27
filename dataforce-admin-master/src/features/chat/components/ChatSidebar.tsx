import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
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
  onContactAdmin?: () => void;
  isAdmin: boolean;
  loading?: boolean;
}

export function ChatSidebar({
  groups,
  selectedGroupId,
  onSelectGroup,
  onCreateGroup,
  onContactAdmin,
  isAdmin,
  loading,
}: ChatSidebarProps) {
  const [search, setSearch] = useState('');

  const { saGroups, companyGroups } = useMemo(() => {
    const sortFn = (a: IChatGroup, b: IChatGroup) => {
      const aTime = a.last_message?.created_at ?? a.created_at;
      const bTime = b.last_message?.created_at ?? b.created_at;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    };

    let filtered = [...groups];
    if (search.trim()) {
      const s = search.toLowerCase();
      filtered = filtered.filter((g) => g.name.toLowerCase().includes(s));
    }

    const sa = filtered.filter((g) => g.is_super_admin_group).sort(sortFn);
    const company = filtered.filter((g) => !g.is_super_admin_group).sort(sortFn);

    return { saGroups: sa, companyGroups: company };
  }, [groups, search]);

  const showSaSection = saGroups.length > 0 || !!onContactAdmin;

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

        {!loading && saGroups.length === 0 && companyGroups.length === 0 && (
          <Typography variant="body2" color="text.disabled" sx={{ p: 2, textAlign: 'center' }}>
            {search ? 'No groups found' : 'No groups available'}
          </Typography>
        )}

        {/* Super Admin Groups Section */}
        {showSaSection && (
          <>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ px: 1, pt: 1.5, pb: 0.5 }}
            >
              <Iconify icon="mdi:shield-crown-outline" sx={{ color: 'primary.main', width: 18 }} />
              <Typography variant="caption" fontWeight="bold" color="primary.main" sx={{ flexGrow: 1 }}>
                BosMetrics Admin
              </Typography>
              {onContactAdmin && (
                <IconButton size="small" onClick={onContactAdmin} title="Contact BosMetrics Admin" sx={{ color: 'primary.main' }}>
                  <Iconify icon="mdi:message-plus-outline" width={18} />
                </IconButton>
              )}
            </Stack>

            {saGroups.map((group) => (
              <ChatGroupItem
                key={group.id}
                group={group}
                selected={group.id === selectedGroupId}
                onClick={() => onSelectGroup(group.id)}
              />
            ))}

            {companyGroups.length > 0 && (
              <Divider sx={{ my: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Company Chat
                </Typography>
              </Divider>
            )}
          </>
        )}

        {/* Company Groups Section */}
        {companyGroups.map((group) => (
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
