import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Collapse,
  FormControlLabel,
  IconButton,
  LinearProgress,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import moment from 'moment';
import { useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import {
  IAdpTimeCard,
  useAdpUserHistoryQuery,
  useRefreshAdpUserHistoryMutation,
} from 'src/api/adpRepository';

const fmt = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
};
const fmtDecimal = (min: number) => (min / 60).toFixed(2);

/**
 * Estado del periodo de nomina en ADP: "Open" = todavia se pueden registrar horas,
 * "Locked" = ADP ya cerro el periodo (no es un error, solo significa que no cambia).
 */
const periodStatus = (status: string | null) => {
  if (status === 'Open') return { label: 'In progress', color: 'warning' as const };
  if (status === 'Locked') return { label: 'Closed', color: 'default' as const };
  return { label: status || '—', color: 'default' as const };
};

function PeriodRow({ tc, maxMinutes }: { tc: IAdpTimeCard; maxMinutes: number }) {
  const [open, setOpen] = useState(false);
  const days = (tc.daily_totals || []).filter((d) => d.date && d.minutes > 0);
  const hasHours = tc.total_minutes > 0;
  const pct = maxMinutes ? Math.round((tc.total_minutes / maxMinutes) * 100) : 0;

  return (
    <>
      <TableRow hover sx={{ opacity: hasHours ? 1 : 0.55, '& > *': { borderBottom: 'unset' } }}>
        <TableCell sx={{ width: 44 }}>
          {days.length > 0 && (
            <IconButton size="small" onClick={() => setOpen(!open)}>
              <Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />
            </IconButton>
          )}
        </TableCell>
        <TableCell>
          <Typography variant="body2" fontWeight={600}>
            {moment(tc.period_start).format('MMM D')} – {moment(tc.period_end).format('MMM D, YYYY')}
          </Typography>
          {days.length > 0 && (
            <Typography variant="caption" color="text.secondary">
              {days.length} {days.length === 1 ? 'day' : 'days'} worked
            </Typography>
          )}
        </TableCell>
        <TableCell>
          <Tooltip
            title={
              tc.period_status === 'Locked'
                ? 'ADP closed this pay period: the hours are final.'
                : 'Pay period still open in ADP: the hours can still change.'
            }
          >
            <Chip size="small" {...periodStatus(tc.period_status)} />
          </Tooltip>
        </TableCell>
        <TableCell sx={{ minWidth: 220 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <LinearProgress
              variant="determinate"
              value={pct}
              color={hasHours ? 'primary' : 'inherit'}
              sx={{ flex: 1, height: 8, borderRadius: 1, bgcolor: 'action.hover' }}
            />
            <Typography variant="body2" fontWeight={700} sx={{ minWidth: 70, textAlign: 'right' }}>
              {hasHours ? fmt(tc.total_minutes) : '—'}
            </Typography>
          </Stack>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={4} sx={{ py: 0, border: 0 }}>
          <Collapse in={open} unmountOnExit>
            <Box sx={{ px: 5, py: 1.5, bgcolor: 'action.hover', borderRadius: 1, mb: 1 }}>
              <Stack spacing={0.75}>
                {days.map((d, i) => (
                  <Stack
                    key={i}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ maxWidth: 380 }}
                  >
                    <Typography variant="caption">
                      {moment(d.date).format('ddd, MMM D')}
                    </Typography>
                    <Typography variant="caption" fontWeight={600}>
                      {fmt(d.minutes)}{' '}
                      <Typography component="span" variant="caption" color="text.secondary">
                        · {d.pay_code}
                      </Typography>
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export function AdpUserHoursSection({ userId }: { userId: number }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [hideEmpty, setHideEmpty] = useState(true);
  const { data, isFetching } = useAdpUserHistoryQuery(
    userId,
    from || undefined,
    to || undefined,
    !!userId
  );
  // Refresca el historico desde ADP en segundo plano al abrir el perfil (con throttle).
  const { mutate: refreshHistory, isLoading: refreshing } = useRefreshAdpUserHistoryMutation(userId);
  useEffect(() => {
    if (userId) refreshHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const cards = data?.time_cards ?? [];
  const visible = hideEmpty ? cards.filter((c) => c.total_minutes > 0) : cards;
  const maxMinutes = cards.reduce((max, c) => Math.max(max, c.total_minutes), 1);
  const periodsWithHours = cards.filter((c) => c.total_minutes > 0).length;
  const avg = periodsWithHours && data ? data.total_minutes / periodsWithHours : 0;

  return (
    <Card>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          flexWrap="wrap"
          gap={2}
          sx={{ mb: 1 }}
        >
          <Box>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Typography variant="h5">Worked hours (ADP)</Typography>
              {refreshing && (
                <Chip
                  size="small"
                  color="info"
                  icon={<CircularProgress size={12} color="inherit" />}
                  label="Updating…"
                />
              )}
            </Stack>
            {data && (
              <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                Total <b>{data.total_hours}h</b> · {periodsWithHours} periods with hours · avg{' '}
                <b>{fmtDecimal(avg)}h</b>/period
              </Typography>
            )}
          </Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              type="date"
              label="From"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
            <TextField
              type="date"
              label="To"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </Stack>
        </Stack>

        <FormControlLabel
          control={
            <Switch checked={hideEmpty} onChange={(e) => setHideEmpty(e.target.checked)} />
          }
          label="Hide empty periods"
        />

        {isFetching && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {data && (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 44 }} />
                <TableCell>Pay period</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Total worked</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visible.map((tc) => (
                <PeriodRow key={tc.id} tc={tc} maxMinutes={maxMinutes} />
              ))}
              {!visible.length && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography color="text.secondary" sx={{ py: 1 }}>
                      No hours recorded in ADP for this range.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
