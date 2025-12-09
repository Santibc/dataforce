import { Card, Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import { useCreateUserMutation } from 'src/api/userRepository';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { useSnackbar } from 'src/components/snackbar';
import { APP_NAME } from 'src/config';
import { PATHS } from 'src/routes/paths';
import AdminUserCreateForm, { CreateUserFormType } from './AdminUserCreateForm';

export const AdminUserCreatePage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const createUsuarioMutation = useCreateUserMutation();
  const { themeStretch } = useSettingsContext();
  const navigate = useNavigate();

  const handleSubmit = async (values: CreateUserFormType) => {
    await createUsuarioMutation.mutateAsync(values);
    enqueueSnackbar({ message: 'User created!' });
    navigate(PATHS.dashboard.adminUsers.list);
  };

  return (
    <>
      <Helmet>
        <title> Panel Administrativo | {APP_NAME}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Alta - Administradores"
          links={[{ name: 'Listado', href: PATHS.dashboard.adminUsers.list }, { name: 'Alta' }]}
        />

        <Card sx={{ p: 3 }}>
          <AdminUserCreateForm onSubmit={handleSubmit} />
        </Card>
      </Container>
    </>
  );
};

export default AdminUserCreatePage;
