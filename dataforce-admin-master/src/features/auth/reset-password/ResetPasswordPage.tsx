import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { Link, Typography } from '@mui/material';
// routes
import { PATHS } from '../../../routes/paths';
// components
import Iconify from '../../../components/iconify';
// sections

// assets
import { useResetPasswordMutation } from 'src/api/AuthRepository';
import { useSnackbar } from 'src/components/snackbar';
import { APP_NAME } from 'src/config';
import { PasswordIcon } from '../../../assets/icons';
import AuthResetPasswordForm, { ResetPasswordFormType } from './AuthResetPasswordForm';

// ----------------------------------------------------------------------

export default function ResetPasswordPage() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const resetPasswordMutation = useResetPasswordMutation();

  const handleSubmit = async (formValue: ResetPasswordFormType) => {
    await resetPasswordMutation.mutateAsync(formValue);
    enqueueSnackbar('Email sent!');
    navigate(PATHS.auth.resetPassword);
  };

  return (
    <>
      <Helmet>
        <title> Reset Password | {APP_NAME}</title>
      </Helmet>

      <PasswordIcon sx={{ mb: 5, height: 96 }} />

      <Typography variant="h3" paragraph>
        Forgot your password?
      </Typography>

      <Typography sx={{ color: 'text.secondary', mb: 5 }}>
        Please enter the email address associated with your account and We will email you a link to
        reset your password.
      </Typography>

      <AuthResetPasswordForm onSubmit={handleSubmit} />

      <Link
        to={PATHS.auth.login}
        component={RouterLink}
        color="inherit"
        variant="subtitle2"
        sx={{
          mt: 3,
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
