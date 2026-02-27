import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';
import { useContactAdminMutation } from 'src/api/chatRepository';

interface ChatContactAdminDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (groupId: number) => void;
}

interface FormValues {
  name: string;
}

export function ChatContactAdminDialog({ open, onClose, onCreated }: ChatContactAdminDialogProps) {
  const mutation = useContactAdminMutation();

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { name: '' },
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values.name, {
      onSuccess: (group) => {
        enqueueSnackbar('Group created successfully', { variant: 'success' });
        reset();
        onClose();
        onCreated?.(group.id);
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Contact BosMetrics Admin</DialogTitle>

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
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={mutation.isLoading}>
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
