import { Card, Container, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router';
import {
  useChangePasswordMutation,
  useEditUserMutation,
  useUserQuery,
} from 'src/api/userRepository';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { useSettingsContext } from 'src/components/settings';
import { useSnackbar } from 'src/components/snackbar';
import { PATHS } from 'src/routes/paths';
import AdminUserChangePasswordForm, { ChangePasswordFormType } from './AdminUserChangePasswordForm';
import AdminUserEditForm, { EditUserFormType } from './AdminUserEditForm';

export const AdminUserEditPage = () => {
  const params = useParams<{ id: string }>();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { themeStretch } = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('1');

  const editUsuarioMutation = useEditUserMutation();
  const changePasswordMutation = useChangePasswordMutation();
  const userQuery = useUserQuery(Number(params.id));

  const handlePasswordChange = async (values: ChangePasswordFormType) => {
    await changePasswordMutation.mutateAsync({ ...values, id: Number(params.id) });
    enqueueSnackbar({ message: 'Password Changed!' });
    navigate(PATHS.dashboard.adminUsers.list);
  };

  const handleUserUpdate = async (values: EditUserFormType) => {
    await editUsuarioMutation.mutateAsync({ ...values, id: Number(params.id) });
    enqueueSnackbar({ message: 'User Updated!' });
    navigate(PATHS.dashboard.adminUsers.list);
  };

  return (
    <>
      <Helmet>
        <title> Panel Administrativo | TheGelatina</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit - Administradores"
          links={[{ name: 'Listado', href: PATHS.dashboard.adminUsers.list }, { name: 'Edit' }]}
        />

        <Tabs value={currentTab} onChange={(event, newValue) => setCurrentTab(newValue)}>
          <Tab value={'1'} label={'Edit Usuario'} />
          <Tab value={'2'} label={'Cambiar Contraseña'} />
        </Tabs>

        {currentTab === '1' && (
          <Card sx={{ p: 3 }}>
            <AdminUserEditForm onSubmit={handleUserUpdate} values={userQuery.data} />
          </Card>
        )}
        {currentTab === '2' && (
          <Card sx={{ p: 3 }}>
            <AdminUserChangePasswordForm onSubmit={handlePasswordChange} />
          </Card>
        )}
      </Container>
    </>
  );
};

export default AdminUserEditPage;
