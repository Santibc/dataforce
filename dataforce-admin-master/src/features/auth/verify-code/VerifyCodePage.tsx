import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { Link, Typography } from '@mui/material';
// routes

// components
import Iconify from '../../../components/iconify';

// assets
import { useVerifyCodeMutation } from 'src/api/AuthRepository';
import { useSnackbar } from 'src/components/snackbar';
import { APP_NAME } from 'src/config';
import { PATHS } from 'src/routes/paths';
import { EmailInboxIcon } from '../../../assets/icons';
import AuthVerifyCodeForm, { VerifyCodeFormType } from './AuthVerifyCodeForm';

// ----------------------------------------------------------------------

export default function VerifyCodePage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const verifyCodeMutation = useVerifyCodeMutation();

  const handleSubmit = async (formValue: VerifyCodeFormType) => {
    await verifyCodeMutation.mutateAsync(formValue);
    enqueueSnackbar({ message: 'Code verified!' });
    navigate(PATHS.auth.login);
  };

  return (
    <>
      <Helmet>
        <title> Verify Code | {APP_NAME}</title>
      </Helmet>

      <EmailInboxIcon sx={{ mb: 5, height: 96 }} />

      <Typography variant="h3" paragraph>
        Please check your email!
      </Typography>

      <Typography sx={{ color: 'text.secondary', mb: 5 }}>
        We have emailed a 6-digit confirmation code, please enter the code in below box to verify
        your email.
      </Typography>

      <AuthVerifyCodeForm onSubmit={handleSubmit} />

      <Typography variant="body2" sx={{ my: 3 }}>
        Don’t have a code? &nbsp;
        <Link variant="subtitle2">Resend code</Link>
      </Typography>

      <Link
        to={PATHS.auth.login}
        component={RouterLink}
        color="inherit"
        variant="subtitle2"
        sx={{
          mx: 'auto',
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:chevron-left-fill" width={16} />
        Return to sign in
      </Link>
    </>
  );
}
