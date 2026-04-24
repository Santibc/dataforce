import { Box, Button, Divider, IconButton, Stack, Typography } from '@mui/material';
import moment from 'moment';
import { FC, ReactNode, useMemo } from 'react';
import { IDailyLog } from 'src/api/dailyLogRepository';
import { useAllEventTypesQuery } from 'src/api/eventTypeRepository';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import {
  SEVERITY_COLOR_MAP,
  SEVERITY_LABEL_MAP,
  STATUS_COLOR_MAP,
  prettifySlug,
} from './dailyLogConstants';

interface DailyLogViewProps {
  data: IDailyLog;
  onClose: () => void;
}

const Field: FC<{ label: string; children: ReactNode }> = ({ label, children }) => (
  <Box>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Box sx={{ mt: 0.5 }}>{children}</Box>
  </Box>
);

export const DailyLogView: FC<DailyLogViewProps> = ({ data, onClose }) => {
  const { data: eventTypes } = useAllEventTypesQuery(true);
  const eventTypeLabel = useMemo(() => {
    const match = (eventTypes || []).find((t) => t.slug === data.event_type);
    return match?.name || prettifySlug(data.event_type);
  }, [eventTypes, data.event_type]);

  return (
  <Stack spacing={2}>
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant="h5">Daily Log Details</Typography>
      <IconButton onClick={onClose}>
        <Iconify icon="eva:close-fill" />
      </IconButton>
    </Stack>

    <Divider />

    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
      <Field label="Date">
        <Typography>{moment(data.date).format('MM/DD/YYYY')}</Typography>
      </Field>
      <Field label="Driver">
        <Typography>{data.driver_name}</Typography>
      </Field>
      <Field label="Admin">
        <Typography>{data.admin_name}</Typography>
      </Field>
    </Stack>

    <Stack direction="row" spacing={2} flexWrap="wrap">
      <Field label="Event Type">
        <Label variant="soft" color="primary">
          {eventTypeLabel}
        </Label>
      </Field>
      <Field label="Severity">
        <Label variant="soft" color={SEVERITY_COLOR_MAP[data.severity] || 'default'}>
          {SEVERITY_LABEL_MAP[data.severity] || data.severity}
        </Label>
      </Field>
      <Field label="Status">
        <Label variant="soft" color={STATUS_COLOR_MAP[data.status] || 'default'}>
          {data.status === 'submitted' ? 'Submitted' : 'Draft'}
        </Label>
      </Field>
    </Stack>

    {data.submitted_at && (
      <Field label="Submitted At">
        <Typography>{moment(data.submitted_at).format('MM/DD/YYYY HH:mm')}</Typography>
      </Field>
    )}

    <Field label="Description">
      <Typography sx={{ whiteSpace: 'pre-wrap' }}>
        {data.description || '—'}
      </Typography>
    </Field>

    <Field label="Action Taken">
      <Typography sx={{ whiteSpace: 'pre-wrap' }}>
        {data.action_taken || '—'}
      </Typography>
    </Field>

    <Stack direction="row" justifyContent="flex-end" sx={{ pt: 1 }}>
      <Button variant="contained" onClick={onClose}>
        Close
      </Button>
    </Stack>
  </Stack>
  );
};
