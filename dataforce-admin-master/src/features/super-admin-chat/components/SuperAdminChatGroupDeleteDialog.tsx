import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { useSADeleteChatGroupMutation } from 'src/api/superAdminChatRepository';
import type { IChatGroup } from 'src/api/chatRepository';

interface Props {
  open: boolean;
  onClose: () => void;
  group: IChatGroup | null;
  onDeleted: () => void;
}

export function SuperAdminChatGroupDeleteDialog({ open, onClose, group, onDeleted }: Props) {
  const deleteMutation = useSADeleteChatGroupMutation();
  const [confirmText, setConfirmText] = useState('');

  if (!group) return null;

  const isGlobal = group.type === 'global';
  const canConfirm = isGlobal ? confirmText === group.name : true;

  const handleDelete = () => {
    deleteMutation.mutate(
      { id: group.id, confirm: isGlobal ? true : undefined },
      {
        onSuccess: () => {
          enqueueSnackbar('Group deleted', { variant: 'success' });
          setConfirmText('');
          onClose();
          onDeleted();
        },
      }
    );
  };

  const handleClose = () => {
    setConfirmText('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete Group</DialogTitle>

      <DialogContent>
        {isGlobal ? (
          <>
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              This is a <strong>GLOBAL</strong> group. This action will affect all owners. Are you
              sure you want to delete it?
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Type the group name to confirm: <strong>{group.name}</strong>
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={group.name}
            />
          </>
        ) : (
          <Typography variant="body2">
            Are you sure you want to delete the group <strong>{group.name}</strong>? Messages will
            be permanently lost.
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={!canConfirm || deleteMutation.isLoading}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
