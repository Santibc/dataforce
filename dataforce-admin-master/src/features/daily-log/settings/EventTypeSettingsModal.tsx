import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';
import {
  IEventType,
  useAllEventTypesQuery,
  useCreateEventTypeMutation,
  useDeleteEventTypeMutation,
  useUpdateEventTypeMutation,
} from 'src/api/eventTypeRepository';
import { useConfirm } from 'src/components/confirm-action/ConfirmAction';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { ModalTitleHeader } from 'src/components/modal-header-with-close-button/ModalTitleHeader';
import {
  SEVERITY_COLOR_MAP,
  SEVERITY_LABEL_MAP,
} from '../dailyLogConstants';
import { EventTypeForm, EventTypeFormFields } from './EventTypeForm';

interface EventTypeSettingsModalProps {
  onClose: () => void;
}

type ViewMode =
  | { mode: 'list' }
  | { mode: 'create' }
  | { mode: 'edit'; item: IEventType };

export const EventTypeSettingsModal: FC<EventTypeSettingsModalProps> = ({ onClose }) => {
  const { data: eventTypes, isFetching } = useAllEventTypesQuery(true);
  const { mutateAsync: createEventType } = useCreateEventTypeMutation();
  const { mutateAsync: updateEventType } = useUpdateEventTypeMutation();
  const { mutateAsync: deleteEventType } = useDeleteEventTypeMutation();
  const confirm = useConfirm();

  const [view, setView] = useState<ViewMode>({ mode: 'list' });

  const goToList = () => setView({ mode: 'list' });

  const handleCreate = async (values: EventTypeFormFields) => {
    await createEventType({
      name: values.name.trim(),
      default_severity: values.default_severity || null,
      default_description: values.default_description || null,
      default_action_taken: values.default_action_taken || null,
      is_active: values.is_active,
    });
    goToList();
  };

  const handleUpdate = async (values: EventTypeFormFields) => {
    if (view.mode !== 'edit') return;
    await updateEventType({
      id: view.item.id,
      name: values.name.trim(),
      default_severity: values.default_severity || null,
      default_description: values.default_description || null,
      default_action_taken: values.default_action_taken || null,
      is_active: values.is_active,
    });
    goToList();
  };

  const handleToggleActive = async (item: IEventType) => {
    await updateEventType({
      id: item.id,
      name: item.name,
      default_severity: item.default_severity,
      default_description: item.default_description,
      default_action_taken: item.default_action_taken,
      is_active: !item.is_active,
    });
  };

  const handleDelete = (item: IEventType) => {
    confirm({
      title: 'Delete event type',
      content: `Are you sure you want to delete "${item.name}"? Existing daily logs using this type will keep their label.`,
      action: async () => deleteEventType(item.id),
    });
  };

  if (view.mode === 'create') {
    return (
      <EventTypeForm onSubmit={handleCreate} onBack={goToList} />
    );
  }

  if (view.mode === 'edit') {
    return (
      <EventTypeForm
        edit
        initialValues={{
          name: view.item.name,
          default_severity: view.item.default_severity || '',
          default_description: view.item.default_description || '',
          default_action_taken: view.item.default_action_taken || '',
          is_active: view.item.is_active,
        }}
        onSubmit={handleUpdate}
        onBack={goToList}
      />
    );
  }

  const items = eventTypes || [];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        paddingLeft: '16px',
        paddingRight: '8px',
        maxHeight: '700px',
        overflowY: 'auto',
        zIndex: 0,
      }}
    >
      <ModalTitleHeader title="Event Type Settings" onClose={onClose} />

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="body2" color="text.secondary">
          Manage the event types available when creating daily logs. For each type you can set
          default severity, description and action taken — those values will auto-fill the form.
        </Typography>
        <Button
          variant="contained"
          size="small"
          onClick={() => setView({ mode: 'create' })}
          startIcon={<Iconify icon="eva:plus-fill" />}
          sx={{ flexShrink: 0, ml: 2 }}
        >
          Add Type
        </Button>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {isFetching && items.length === 0 ? (
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Loading…
          </Typography>
        </Box>
      ) : items.length === 0 ? (
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No event types configured yet. Click "Add Type" to create the first one.
          </Typography>
        </Box>
      ) : (
        <Stack spacing={1.25} sx={{ pb: 2 }}>
          {items.map((item) => (
            <Paper
              key={item.id}
              variant="outlined"
              sx={{
                px: 2,
                py: 1.5,
                borderRadius: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                opacity: item.is_active ? 1 : 0.6,
                transition: 'opacity .2s',
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                  <Typography variant="subtitle2" noWrap>
                    {item.name}
                  </Typography>
                  {item.default_severity && (
                    <Label
                      variant="soft"
                      color={SEVERITY_COLOR_MAP[item.default_severity] || 'default'}
                    >
                      {SEVERITY_LABEL_MAP[item.default_severity] || item.default_severity}
                    </Label>
                  )}
                  {!item.is_active && (
                    <Label variant="soft" color="default">
                      Inactive
                    </Label>
                  )}
                </Stack>
                {(item.default_description || item.default_action_taken) && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {item.default_description || item.default_action_taken}
                  </Typography>
                )}
              </Box>

              <Tooltip title={item.is_active ? 'Disable' : 'Enable'}>
                <Switch
                  size="small"
                  checked={item.is_active}
                  onChange={() => handleToggleActive(item)}
                />
              </Tooltip>

              <Tooltip title="Edit">
                <IconButton size="small" onClick={() => setView({ mode: 'edit', item })}>
                  <Iconify icon="eva:edit-fill" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  sx={{ color: 'error.main' }}
                  onClick={() => handleDelete(item)}
                >
                  <Iconify icon="eva:trash-2-outline" />
                </IconButton>
              </Tooltip>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
};
