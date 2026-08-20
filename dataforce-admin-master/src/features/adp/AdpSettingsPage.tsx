import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
  adpErrorMessage,
  IAdpTestConnectionResult,
  useAdpConnectionQuery,
  useSaveAdpConnectionMutation,
  useTestAdpConnectionMutation,
} from 'src/api/adpRepository';

const DEFAULT_BASE_URL = 'https://api.adp.com';
const DEFAULT_TOKEN_URL = 'https://accounts.adp.com/auth/oauth/v2/token';

export default function AdpSettingsPage() {
  const { data: status, isLoading } = useAdpConnectionQuery();
  const { mutateAsync: save, isLoading: saving } = useSaveAdpConnectionMutation();
  const { mutateAsync: test, isLoading: testing } = useTestAdpConnectionMutation();

  const [form, setForm] = useState({
    client_id: '',
    client_secret: '',
    certificate_pem: '',
    private_key: '',
    base_url: DEFAULT_BASE_URL,
    token_url: DEFAULT_TOKEN_URL,
    active: true,
  });
  const [testResult, setTestResult] = useState<IAdpTestConnectionResult | null>(null);

  // Precarga el formulario con lo que ya esta guardado en la base de datos.
  // Los secretos no viajan en claro: se dejan vacios y solo se envian si el
  // usuario escribe uno nuevo.
  useEffect(() => {
    if (!status) return;
    setForm({
      client_id: status.client_id ?? '',
      client_secret: '',
      private_key: '',
      certificate_pem: status.certificate_pem ?? '',
      base_url: status.base_url ?? DEFAULT_BASE_URL,
      token_url: status.token_url ?? DEFAULT_TOKEN_URL,
      active: status.active ?? true,
    });
  }, [status]);

  const onChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const configured = !!status?.configured;

  const canSave =
    !!form.client_id &&
    (configured ||
      (!!form.client_secret && !!form.certificate_pem && !!form.private_key));

  const onSave = async () => {
    await save({
      client_id: form.client_id,
      base_url: form.base_url || DEFAULT_BASE_URL,
      token_url: form.token_url || DEFAULT_TOKEN_URL,
      active: form.active,
      // Solo se mandan los secretos que el usuario haya escrito; el backend
      // conserva los anteriores cuando llegan vacios.
      ...(form.client_secret ? { client_secret: form.client_secret } : {}),
      ...(form.certificate_pem ? { certificate_pem: form.certificate_pem } : {}),
      ...(form.private_key ? { private_key: form.private_key } : {}),
    });
    setForm((prev) => ({ ...prev, client_secret: '', private_key: '' }));
    setTestResult(null);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h3" sx={{ mb: 1 }}>
        ADP Configuration
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        ADP API Central credentials. Stored encrypted in the database.
      </Typography>

      {isLoading && (
        <Stack alignItems="center" sx={{ py: 5 }}>
          <CircularProgress />
        </Stack>
      )}

      {!isLoading && status && (
        <Alert severity={status.configured ? 'success' : 'info'} sx={{ mb: 3 }}>
          {status.configured
            ? `Connection configured${status.client_id ? ` — Client ID: ${status.client_id}` : ''}.`
            : 'No ADP connection configured yet.'}
        </Alert>
      )}

      {!isLoading && (
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
                placeholder={status?.client_secret_preview ?? ''}
                helperText={
                  status?.has_client_secret
                    ? `Saved (${status.client_secret_preview}). Leave blank to keep it.`
                    : 'Required.'
                }
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
                placeholder={
                  status?.private_key_preview ??
                  '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----'
                }
                helperText={
                  status?.has_private_key
                    ? 'Saved and hidden for security. Leave blank to keep it.'
                    : 'Required.'
                }
              />
              <TextField
                label="API base URL"
                value={form.base_url}
                onChange={onChange('base_url')}
                fullWidth
              />
              <TextField
                label="Token URL"
                value={form.token_url}
                onChange={onChange('token_url')}
                fullWidth
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={form.active}
                    onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))}
                  />
                }
                label="Active"
              />

              <Stack direction="row" spacing={2}>
                <Button variant="contained" disabled={!canSave || saving} onClick={onSave}>
                  {saving ? <CircularProgress size={20} color="inherit" /> : 'Save'}
                </Button>
                <Button
                  variant="outlined"
                  disabled={testing || !configured}
                  onClick={async () => {
                    try {
                      setTestResult(await test());
                    } catch (e) {
                      // 422 = el backend explica por que no puede probar la conexion.
                      setTestResult({ ok: false, error: adpErrorMessage(e) });
                    }
                  }}
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
      )}
    </Box>
  );
}
