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
  ISuperAdminOwner,
  useSAAddMembersMutation,
  useSAAllOwnersQuery,
  useSARemoveMembersMutation,
} from 'src/api/superAdminChatRepository';
import type { IChatGroupDetail } from 'src/api/chatRepository';

interface Props {
  open: boolean;
  onClose: () => void;
  group: IChatGroupDetail | null;
}

export function SuperAdminChatGroupMembersDialog({ open, onClose, group }: Props) {
  const { data: allOwners = [] } = useSAAllOwnersQuery();
  const addMutation = useSAAddMembersMutation();
  const removeMutation = useSARemoveMembersMutation();
  const [selectedOwners, setSelectedOwners] = useState<ISuperAdminOwner[]>([]);

  if (!group) return null;

  const memberIds = new Set(group.members.map((m) => m.id));
  const availableOwners = allOwners.filter((o) => !memberIds.has(o.id));

  const handleAddMembers = () => {
    if (selectedOwners.length === 0) return;

    addMutation.mutate(
      { groupId: group.id, member_ids: selectedOwners.map((o) => o.id) },
      {
        onSuccess: () => {
          enqueueSnackbar('Members added', { variant: 'success' });
          setSelectedOwners([]);
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
          <Typography variant="subtitle2">Add Owners</Typography>
          <Stack direction="row" spacing={1}>
            <Autocomplete
              multiple
              options={availableOwners}
              value={selectedOwners}
              onChange={(_, val) => setSelectedOwners(val)}
              getOptionLabel={(opt) => `${opt.firstname} ${opt.lastname} (${opt.company_name})`}
              isOptionEqualToValue={(opt, val) => opt.id === val.id}
              renderInput={(params) => (
                <TextField {...params} size="small" placeholder="Search owner..." />
              )}
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleAddMembers}
              disabled={selectedOwners.length === 0 || addMutation.isLoading}
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
              {group.members.map((member: any) => (
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
                        {member.company_name && (
                          <Chip
                            label={member.company_name}
                            size="small"
                            color="info"
                            variant="outlined"
                            sx={{ height: 16, fontSize: 10 }}
                          />
                        )}
                        {(member.roles ?? []).map((role: string) => (
                          <Chip
                            key={role}
                            label={role}
                            size="small"
                            sx={{ height: 16, fontSize: 10 }}
                          />
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
