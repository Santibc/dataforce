import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { IChatGroup, useUpdateChatGroupMutation } from 'src/api/chatRepository';

interface ChatGroupEditDialogProps {
  open: boolean;
  onClose: () => void;
  group: IChatGroup | null;
}

interface FormValues {
  name: string;
  mode: 'bidirectional' | 'unilateral';
  auto_add_new_members: boolean;
  show_history_to_new_members: boolean;
}

export function ChatGroupEditDialog({ open, onClose, group }: ChatGroupEditDialogProps) {
  const updateMutation = useUpdateChatGroupMutation();

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      name: '',
      mode: 'bidirectional',
      auto_add_new_members: false,
      show_history_to_new_members: true,
    },
  });

  useEffect(() => {
    if (group) {
      reset({
        name: group.name,
        mode: group.mode,
        auto_add_new_members: group.auto_add_new_members,
        show_history_to_new_members: group.show_history_to_new_members,
      });
    }
  }, [group, reset]);

  const onSubmit = (values: FormValues) => {
    if (!group) return;

    updateMutation.mutate(
      { id: group.id, ...values },
      {
        onSuccess: () => {
          enqueueSnackbar('Group updated successfully', { variant: 'success' });
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Edit Group</DialogTitle>

        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Name is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Group name"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <TextField
              label="Group type"
              value={group?.type === 'global' ? 'Global' : 'Custom'}
              fullWidth
              disabled
            />

            <Controller
              name="mode"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Communication mode" select fullWidth>
                  <MenuItem value="bidirectional">Bidirectional (everyone can write)</MenuItem>
                  <MenuItem value="unilateral">Unilateral (admin only)</MenuItem>
                </TextField>
              )}
            />

            <Controller
              name="auto_add_new_members"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} onChange={field.onChange} />}
                  label="Auto-add new employees"
                />
              )}
            />

            <Controller
              name="show_history_to_new_members"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} onChange={field.onChange} />}
                  label="Show history to new members"
                />
              )}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={updateMutation.isLoading}>
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
