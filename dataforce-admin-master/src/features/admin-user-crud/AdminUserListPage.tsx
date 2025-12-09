import { Button, Card, Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
import { useAllUsersQuery, useDeleteUserMutation } from 'src/api/userRepository';
import { useConfirm } from 'src/components/confirm-action/ConfirmAction';
import { PATHS } from 'src/routes/paths';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import Iconify from '../../components/iconify';
import { useSettingsContext } from '../../components/settings';
import { AdminUsersDataGrid } from './AdminUsersDataGrid';

export function AdminUserListPage() {
  const { themeStretch } = useSettingsContext();
  const confirm = useConfirm();
  const usersQuery = useAllUsersQuery();
  const deleteUserMutation = useDeleteUserMutation();

  return (
    <>
      <Helmet>
        <title> Panel Administrativo | TheGelatina </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Listado - Administradores"
          links={[{ name: 'Listado' }]}
          action={
            <Button
              to={PATHS.dashboard.adminUsers.create}
              component={RouterLink}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Nuevo Usuario
            </Button>
          }
        />

        <Card
          sx={{
            height: 600,
          }}
        >
          <AdminUsersDataGrid
            data={usersQuery.data ?? []}
            isLoading={usersQuery.isLoading}
            onDelete={(id) =>
              confirm({
                action: () => deleteUserMutation.mutateAsync(id),
              })
            }
          />
        </Card>
      </Container>
    </>
  );
}

export default AdminUserListPage;
