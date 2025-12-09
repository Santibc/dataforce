import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
// @mui
import { Link, Typography } from '@mui/material';
// routes
import { PATHS } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
// sections

// assets
import { useResetPasswordMutation, useUserResetPasswordMutation } from 'src/api/AuthRepository';
import { useSnackbar } from 'src/components/snackbar';
import { APP_NAME } from 'src/config';
import { PasswordIcon } from 'src/assets/icons';
import UserAuthResetPasswordForm, { ResetPasswordFormType } from './UserAuthResetPasswordForm';

// ----------------------------------------------------------------------

export default function UserResetPasswordPage() {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const resetPasswordMutation = useUserResetPasswordMutation();
    const { token } = useParams<{ token: string }>();

    const handleSubmit = async (formValue: ResetPasswordFormType) => {
        await resetPasswordMutation.mutateAsync({ ...formValue, token: token || '' });
        enqueueSnackbar('Done!');
        navigate(PATHS.auth.passwordSuccessfullyReset);
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

            <UserAuthResetPasswordForm onSubmit={handleSubmit} />
        </>
    );
}
