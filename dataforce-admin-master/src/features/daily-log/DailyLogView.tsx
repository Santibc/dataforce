import { Box, Button, Divider, IconButton, Stack, Typography } from '@mui/material';
import moment from 'moment';
import { FC, ReactNode } from 'react';
import { IDailyLog } from 'src/api/dailyLogRepository';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import {
  EVENT_TYPE_LABEL_MAP,
  SEVERITY_COLOR_MAP,
  SEVERITY_LABEL_MAP,
  STATUS_COLOR_MAP,
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

export const DailyLogView: FC<DailyLogViewProps> = ({ data, onClose }) => (
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
          {EVENT_TYPE_LABEL_MAP[data.event_type] || data.event_type}
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
