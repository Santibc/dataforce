import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  MenuItem,
  Select,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import {
  IAdpCandidate,
  IAdpSyncDecision,
  IAdpSyncPreview,
  IAdpUserSummary,
  useAdpSyncPreviewMutation,
  useBulkCreateActiveMutation,
  useConfirmAdpSyncMutation,
  useSyncAdpHoursMutation,
} from 'src/api/adpRepository';

type DecisionMap = Record<string, IAdpSyncDecision>;

const workerName = (c: IAdpCandidate) =>
  `${c.worker.firstname || ''} ${c.worker.lastname || ''}`.trim() || c.worker.aoid;

export default function AdpSyncPage() {
  const { mutateAsync: runPreview, isLoading: previewing } = useAdpSyncPreviewMutation();
  const { mutateAsync: confirm, isLoading: confirming } = useConfirmAdpSyncMutation();
  const { mutateAsync: syncHours, isLoading: syncingHours } = useSyncAdpHoursMutation();
  const { mutateAsync: bulkCreate, isLoading: bulkCreating } = useBulkCreateActiveMutation();

  const [preview, setPreview] = useState<IAdpSyncPreview | null>(null);
  const [decisions, setDecisions] = useState<DecisionMap>({});
  const [tab, setTab] = useState(0);
  const [hoursResult, setHoursResult] = useState<string | null>(null);

  const activeNewCount = preview?.new.filter((c) => c.worker.status === 'Active').length ?? 0;

  const loadPreview = async () => {
    const data = await runPreview();
    const init: DecisionMap = {};
    data.matched.forEach((c) => {
      init[c.worker.aoid] = {
        aoid: c.worker.aoid,
        action: 'link',
        user_id: c.possible_matches[0]?.user_id,
      };
    });
    data.ambiguous.forEach((c) => {
      init[c.worker.aoid] = {
        aoid: c.worker.aoid,
        action: 'ignore',
        user_id: c.possible_matches[0]?.user_id,
      };
    });
    data.new.forEach((c) => {
      init[c.worker.aoid] = {
        aoid: c.worker.aoid,
        action: 'ignore',
        driver_amazon_id: c.worker.amazon_id || undefined,
      };
    });
    setPreview(data);
    setDecisions(init);
  };

  const setDecision = (aoid: string, patch: Partial<IAdpSyncDecision>) =>
    setDecisions((prev) => ({ ...prev, [aoid]: { ...prev[aoid], ...patch } }));

  const onConfirm = async () => {
    const list = Object.values(decisions).filter((d) => d.action !== 'ignore');
    if (!list.length) return;
    await confirm(list);
    await loadPreview();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        sx={{ mb: 3 }}
      >
        <Typography variant="h3">ADP Sync</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" disabled={previewing} onClick={loadPreview}>
            {previewing ? <CircularProgress size={20} color="inherit" /> : 'Sync with ADP'}
          </Button>
          <Button
            variant="outlined"
            disabled={syncingHours}
            onClick={async () => {
              const r: any = await syncHours();
              setHoursResult(
                `Hours synced: ${r?.time_cards ?? 0} time cards (managers queried: ${
                  r?.managers ?? 0
                }).`
              );
            }}
          >
            {syncingHours ? <CircularProgress size={20} /> : 'Sync hours'}
          </Button>
        </Stack>
      </Stack>

      {syncingHours && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Syncing hours from ADP… this can take a few minutes for many drivers, please wait.
        </Alert>
      )}

      {hoursResult && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setHoursResult(null)}>
          {hoursResult}
        </Alert>
      )}

      {!preview && (
        <Alert severity="info">
          Click "Sync with ADP" to fetch ADP workers and compare them with your drivers.
        </Alert>
      )}

      {preview && (
        <Card>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}
            variant="scrollable"
          >
            <Tab label={`Matched (${preview.counts.matched})`} />
            <Tab label={`Ambiguous (${preview.counts.ambiguous})`} />
            <Tab label={`New (${preview.counts.new})`} />
            <Tab label={`Only in system (${preview.counts.only_in_bosmetrics})`} />
          </Tabs>

          <Box sx={{ p: 2, overflowX: 'auto' }}>
            {tab === 0 && (
              <MatchedTable items={preview.matched} decisions={decisions} setDecision={setDecision} />
            )}
            {tab === 1 && (
              <AmbiguousTable
                items={preview.ambiguous}
                decisions={decisions}
                setDecision={setDecision}
              />
            )}
            {tab === 2 && (
              <NewTable items={preview.new} decisions={decisions} setDecision={setDecision} />
            )}
            {tab === 3 && <OnlyBosTable items={preview.only_in_bosmetrics} />}
          </Box>

          {tab < 3 && (
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              {tab === 2 && (
                <Button
                  variant="outlined"
                  color="success"
                  disabled={bulkCreating || activeNewCount === 0}
                  onClick={async () => {
                    await bulkCreate();
                    await loadPreview();
                  }}
                >
                  {bulkCreating ? (
                    <CircularProgress size={20} />
                  ) : (
                    `Create all active (${activeNewCount})`
                  )}
                </Button>
              )}
              <Button variant="contained" disabled={confirming} onClick={onConfirm}>
                {confirming ? <CircularProgress size={20} color="inherit" /> : 'Confirm selection'}
              </Button>
            </Box>
          )}
        </Card>
      )}
    </Box>
  );
}

// ----------------------------------------------------------------------

interface TableProps {
  items: IAdpCandidate[];
  decisions: DecisionMap;
  setDecision: (aoid: string, patch: Partial<IAdpSyncDecision>) => void;
}

const empty = <Typography color="text.secondary">No records in this group.</Typography>;

function MatchedTable({ items, decisions, setDecision }: TableProps) {
  if (!items.length) return empty;
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>ADP Worker</TableCell>
          <TableCell>BosMetrics Driver</TableCell>
          <TableCell>Matched by</TableCell>
          <TableCell align="center">Link</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((c) => {
          const pm = c.possible_matches[0];
          const u = pm?.user;
          const d = decisions[c.worker.aoid];
          return (
            <TableRow key={c.worker.aoid} hover>
              <TableCell>
                {workerName(c)}
                <Typography variant="caption" display="block" color="text.secondary">
                  {c.worker.emails[0]}
                </Typography>
              </TableCell>
              <TableCell>
                {u ? `${u.firstname} ${u.lastname}` : '—'}
                <Typography variant="caption" display="block" color="text.secondary">
                  {u?.email}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip size="small" label={pm?.match_type} />
              </TableCell>
              <TableCell align="center">
                <Checkbox
                  checked={d?.action === 'link'}
                  onChange={(e) =>
                    setDecision(c.worker.aoid, {
                      action: e.target.checked ? 'link' : 'ignore',
                      user_id: pm?.user_id,
                    })
                  }
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function AmbiguousTable({ items, decisions, setDecision }: TableProps) {
  if (!items.length) return empty;
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>ADP Worker</TableCell>
          <TableCell>Choose driver</TableCell>
          <TableCell align="center">Link</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((c) => {
          const d = decisions[c.worker.aoid];
          return (
            <TableRow key={c.worker.aoid} hover>
              <TableCell>
                {workerName(c)}
                <Typography variant="caption" display="block" color="text.secondary">
                  {c.worker.emails[0]} · {c.worker.phones[0]}
                </Typography>
              </TableCell>
              <TableCell sx={{ minWidth: 240 }}>
                <Select
                  size="small"
                  fullWidth
                  value={d?.user_id ?? ''}
                  onChange={(e) => setDecision(c.worker.aoid, { user_id: Number(e.target.value) })}
                >
                  {c.possible_matches.map((pm) => (
                    <MenuItem key={pm.user_id} value={pm.user_id}>
                      {pm.user ? `${pm.user.firstname} ${pm.user.lastname}` : pm.user_id} (
                      {pm.match_type})
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell align="center">
                <Checkbox
                  checked={d?.action === 'link'}
                  onChange={(e) =>
                    setDecision(c.worker.aoid, { action: e.target.checked ? 'link' : 'ignore' })
                  }
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function NewTable({ items, decisions, setDecision }: TableProps) {
  const [showInactive, setShowInactive] = useState(false);
  const activeCount = items.filter((c) => c.worker.status === 'Active').length;
  const inactiveCount = items.length - activeCount;
  const visible = showInactive ? items : items.filter((c) => c.worker.status === 'Active');
  return (
    <>
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        flexWrap="wrap"
        sx={{ mb: 1.5, rowGap: 1 }}
      >
        <Chip size="small" color="success" label={`${activeCount} active`} />
        <Chip size="small" label={`${inactiveCount} inactive / terminated`} />
        <Chip size="small" variant="outlined" label={`Total new: ${items.length}`} />
        <FormControlLabel
          sx={{ ml: 'auto' }}
          control={
            <Checkbox checked={showInactive} onChange={(e) => setShowInactive(e.target.checked)} />
          }
          label="Show inactive / terminated"
        />
        <Typography variant="caption" color="text.secondary">
          Showing {visible.length}
        </Typography>
      </Stack>
      {!visible.length ? (
        empty
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ADP Worker</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Amazon ID</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visible.map((c) => {
              const d = decisions[c.worker.aoid];
              return (
                <TableRow key={c.worker.aoid} hover>
                  <TableCell>{workerName(c)}</TableCell>
                  <TableCell>{c.worker.emails[0] || '—'}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={c.worker.status}
                      color={c.worker.status === 'Active' ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      value={d?.driver_amazon_id ?? ''}
                      onChange={(e) =>
                        setDecision(c.worker.aoid, { driver_amazon_id: e.target.value })
                      }
                      placeholder="optional"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={d?.action ?? 'ignore'}
                      onChange={(e) =>
                        setDecision(c.worker.aoid, {
                          action: e.target.value as IAdpSyncDecision['action'],
                        })
                      }
                    >
                      <MenuItem value="ignore">Ignore</MenuItem>
                      <MenuItem value="create">Create</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </>
  );
}

function OnlyBosTable({ items }: { items: IAdpUserSummary[] }) {
  if (!items.length)
    return <Typography color="text.secondary">All drivers exist in ADP.</Typography>;
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Driver</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Amazon ID</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((u) => (
          <TableRow key={u.id} hover>
            <TableCell>
              {u.firstname} {u.lastname}
            </TableCell>
            <TableCell>{u.email}</TableCell>
            <TableCell>{u.driver_amazon_id}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
