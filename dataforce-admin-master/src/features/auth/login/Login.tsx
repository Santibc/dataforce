// @mui
import { Box, Link, Stack, Tooltip, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ENABLED_FEATURES } from 'src/config';
import LoginLayout from 'src/layouts/login/LoginLayout';
import { PATHS } from 'src/routes/paths';
import { useAuthContext } from '../useAuthContext';
import AuthLoginForm from './AuthLoginForm';
import AuthWithSocial from './AuthWithSocial';

// ----------------------------------------------------------------------

export default function Login() {
  const { method } = useAuthContext();

  return (
    <LoginLayout>
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Login</Typography>
        {ENABLED_FEATURES.REGISTER && (
          <Stack direction="row" spacing={0.5}>
            <Typography variant="body2">New user?</Typography>

            <Link to={PATHS.auth.register} component={RouterLink} variant="subtitle2">
              Create an account
            </Link>
          </Stack>
        )}
        <Tooltip title={method} placement="left">
          <Box
            component="img"
            alt={method}
            src={`/assets/icons/auth/ic_${method}.png`}
            sx={{ width: 32, height: 32, position: 'absolute', right: 0 }}
          />
        </Tooltip>
      </Stack>

      <AuthLoginForm />
      {ENABLED_FEATURES.LOGIN_SOCIAL && <AuthWithSocial />}
    </LoginLayout>
  );
}
