import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { Link, Typography } from '@mui/material';
// routes

// assets

import { useUpdatePasswordMutation } from 'src/api/AuthRepository';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { APP_NAME } from 'src/config';
import { PATHS } from 'src/routes/paths';
import { SentIcon } from '../../../assets/icons';
import AuthNewPasswordForm, { UpdatePasswordFormValueType } from './AuthNewPasswordForm';

// ----------------------------------------------------------------------

export default function NewPasswordPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const updatePasswordMutation = useUpdatePasswordMutation();

  const handleSubmit = async (formValues: UpdatePasswordFormValueType) => {
    await updatePasswordMutation.mutateAsync(formValues);
    enqueueSnackbar({ message: 'Password updated!' });
    navigate(PATHS.auth.login);
  };

  return (
    <>
      <Helmet>
        <title> New Password | {APP_NAME}</title>
      </Helmet>

      <SentIcon sx={{ mb: 5, height: 96 }} />

      <Typography variant="h3" paragraph>
        Request sent successfully!
      </Typography>

      <Typography sx={{ color: 'text.secondary', mb: 5 }}>
        We've sent a 6-digit confirmation email to your email.
        <br />
        Please enter the code in below box to verify your email.
      </Typography>

      <AuthNewPasswordForm onSubmit={handleSubmit} />

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
