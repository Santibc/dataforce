import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import Iconify from 'src/components/iconify';
import {
  IChatGroupDetail,
  useAddMembersMutation,
  useRemoveMembersMutation,
} from 'src/api/chatRepository';
import { IRecievedUser, useAllUsersQuery } from 'src/api/usersRepository';

interface ChatGroupMembersDialogProps {
  open: boolean;
  onClose: () => void;
  group: IChatGroupDetail | null;
}

export function ChatGroupMembersDialog({ open, onClose, group }: ChatGroupMembersDialogProps) {
  const { data: allUsers = [] } = useAllUsersQuery();
  const addMutation = useAddMembersMutation();
  const removeMutation = useRemoveMembersMutation();
  const [selectedUsers, setSelectedUsers] = useState<IRecievedUser[]>([]);

  if (!group) return null;

  const memberIds = new Set(group.members.map((m) => m.id));
  const availableUsers = allUsers.filter((u) => !memberIds.has(u.id));

  const handleAddMembers = () => {
    if (selectedUsers.length === 0) return;

    addMutation.mutate(
      { groupId: group.id, member_ids: selectedUsers.map((u) => u.id) },
      {
        onSuccess: () => {
          enqueueSnackbar('Members added', { variant: 'success' });
          setSelectedUsers([]);
        },
      }
    );
  };

  const handleRemoveMember = (userId: number) => {
    removeMutation.mutate(
      { groupId: group.id, member_ids: [userId] },
      {
        onSuccess: () => {
          enqueueSnackbar('Member removed', { variant: 'success' });
        },
      }
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Manage Members - {group.name}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {/* Add Members */}
          <Typography variant="subtitle2">Add Members</Typography>
          <Stack direction="row" spacing={1}>
            <Autocomplete
              multiple
              options={availableUsers}
              value={selectedUsers}
              onChange={(_, val) => setSelectedUsers(val)}
              getOptionLabel={(opt) => `${opt.firstname} ${opt.lastname}`}
              isOptionEqualToValue={(opt, val) => opt.id === val.id}
              renderInput={(params) => (
                <TextField {...params} size="small" placeholder="Search employee..." />
              )}
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleAddMembers}
              disabled={selectedUsers.length === 0 || addMutation.isLoading}
            >
              Add
            </Button>
          </Stack>

          {/* Current Members */}
          <Typography variant="subtitle2" sx={{ mt: 1 }}>
            Current Members ({group.members.length})
          </Typography>

          <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
            <List dense>
              {group.members.map((member) => (
                <ListItem
                  key={member.id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => handleRemoveMember(member.id)}
                      disabled={removeMutation.isLoading}
                    >
                      <Iconify icon="eva:close-fill" width={18} />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={`${member.firstname} ${member.lastname}`}
                    secondary={
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant="caption">{member.email}</Typography>
                        {member.roles.map((role) => (
                          <Chip key={role} label={role} size="small" sx={{ height: 16, fontSize: 10 }} />
                        ))}
                      </Stack>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
