import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import {
  IAdpTestConnectionResult,
  useAdpConnectionQuery,
  useSaveAdpConnectionMutation,
  useTestAdpConnectionMutation,
} from 'src/api/adpRepository';

export default function AdpSettingsPage() {
  const { data: status } = useAdpConnectionQuery();
  const { mutateAsync: save, isLoading: saving } = useSaveAdpConnectionMutation();
  const { mutateAsync: test, isLoading: testing } = useTestAdpConnectionMutation();

  const [form, setForm] = useState({
    client_id: '',
    client_secret: '',
    certificate_pem: '',
    private_key: '',
  });
  const [testResult, setTestResult] = useState<IAdpTestConnectionResult | null>(null);

  const onChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const canSave =
    form.client_id && form.client_secret && form.certificate_pem && form.private_key;

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h3" sx={{ mb: 1 }}>
        ADP Configuration
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        ADP API Central credentials. Stored encrypted in the database.
      </Typography>

      {status && (
        <Alert severity={status.configured ? 'success' : 'info'} sx={{ mb: 3 }}>
          {status.configured
            ? `Connection configured${status.client_id ? ` — Client ID: ${status.client_id}` : ''}.`
            : 'No ADP connection configured yet.'}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Stack spacing={2.5}>
            <TextField
              label="Client ID"
              value={form.client_id}
              onChange={onChange('client_id')}
              fullWidth
            />
            <TextField
              label="Client Secret"
              type="password"
              value={form.client_secret}
              onChange={onChange('client_secret')}
              fullWidth
            />
            <TextField
              label="Certificate (.pem)"
              value={form.certificate_pem}
              onChange={onChange('certificate_pem')}
              fullWidth
              multiline
              minRows={4}
              placeholder={'-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----'}
            />
            <TextField
              label="Private key (.key)"
              value={form.private_key}
              onChange={onChange('private_key')}
              fullWidth
              multiline
              minRows={4}
              placeholder={'-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----'}
            />

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                disabled={!canSave || saving}
                onClick={async () => {
                  await save(form);
                  setTestResult(null);
                }}
              >
                {saving ? <CircularProgress size={20} color="inherit" /> : 'Save'}
              </Button>
              <Button
                variant="outlined"
                disabled={testing || !status?.configured}
                onClick={async () => setTestResult(await test())}
              >
                {testing ? <CircularProgress size={20} /> : 'Test connection'}
              </Button>
            </Stack>

            {testResult && (
              <Alert severity={testResult.ok ? 'success' : 'error'}>
                {testResult.ok
                  ? `Connection OK (HTTP ${testResult.status}). Sample workers: ${
                      testResult.sample_count ?? 0
                    }.`
                  : `Error: ${testResult.error || 'could not connect to ADP'}`}
              </Alert>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
