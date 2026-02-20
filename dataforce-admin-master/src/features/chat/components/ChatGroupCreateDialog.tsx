import {
  Autocomplete,
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
import { Controller, useForm } from 'react-hook-form';
import {
  ICreateChatGroup,
  useCreateChatGroupMutation,
} from 'src/api/chatRepository';
import { IRecievedUser, useAllUsersQuery } from 'src/api/usersRepository';

interface ChatGroupCreateDialogProps {
  open: boolean;
  onClose: () => void;
}

interface FormValues {
  name: string;
  type: 'custom' | 'global';
  mode: 'bidirectional' | 'unilateral';
  auto_add_new_members: boolean;
  show_history_to_new_members: boolean;
  member_ids: IRecievedUser[];
}

export function ChatGroupCreateDialog({ open, onClose }: ChatGroupCreateDialogProps) {
  const createMutation = useCreateChatGroupMutation();
  const { data: users = [] } = useAllUsersQuery();

  const { control, handleSubmit, watch, reset } = useForm<FormValues>({
    defaultValues: {
      name: '',
      type: 'custom',
      mode: 'bidirectional',
      auto_add_new_members: false,
      show_history_to_new_members: true,
      member_ids: [],
    },
  });

  const groupType = watch('type');

  const onSubmit = (values: FormValues) => {
    const payload: ICreateChatGroup = {
      name: values.name,
      type: values.type,
      mode: values.mode,
      auto_add_new_members: values.auto_add_new_members,
      show_history_to_new_members: values.show_history_to_new_members,
      member_ids: values.type === 'custom' ? values.member_ids.map((u) => u.id) : undefined,
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        enqueueSnackbar('Group created successfully', { variant: 'success' });
        reset();
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Create Chat Group</DialogTitle>

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

            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Group type" select fullWidth>
                  <MenuItem value="custom">Custom</MenuItem>
                  <MenuItem value="global">Global (all employees)</MenuItem>
                </TextField>
              )}
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

            {groupType === 'custom' && (
              <Controller
                name="member_ids"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    options={users}
                    value={field.value}
                    onChange={(_, val) => field.onChange(val)}
                    getOptionLabel={(opt) => `${opt.firstname} ${opt.lastname} (${opt.email})`}
                    isOptionEqualToValue={(opt, val) => opt.id === val.id}
                    renderInput={(params) => (
                      <TextField {...params} label="Select members" placeholder="Search..." />
                    )}
                  />
                )}
              />
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={createMutation.isLoading}>
            Create Group
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
