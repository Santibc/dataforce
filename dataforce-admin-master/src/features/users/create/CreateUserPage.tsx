import { Box, Card, CardContent } from '@mui/material';
import { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import { useGetLoggedUserQuery } from 'src/api/AuthRepository';
import { useCreateUserMutation } from 'src/api/usersRepository';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSnackbar } from 'src/components/snackbar';
import { APP_NAME } from 'src/config';
import { PATHS } from 'src/routes/paths';
import { UserForm } from '../UserForm';

interface CreateUserPageProps {}

export const CreateUserPage: FC<CreateUserPageProps> = (props) => {
  const { mutateAsync: createUser } = useCreateUserMutation();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { data: user } = useGetLoggedUserQuery();
  const company_id = user?.data?.company_id || 0;
  return (
    <>
      <Helmet>
        <title> Documents | {APP_NAME}</title>
      </Helmet>
      <Box sx={{ paddingX: 3 }}>
        <CustomBreadcrumbs
          links={[{ href: PATHS.dashboard.users.list, name: 'Users' }, { name: 'Create' }]}
        />
        <Box pb="10px" />

        <Card>
          <CardContent>
            <UserForm
              onSubmit={async (vals) => {
                try {
                  await createUser({ ...vals, company_id });
                  enqueueSnackbar('User created successfully!', { variant: 'success' });
                  navigate(PATHS.dashboard.users.list);
                } catch (error: any) {
                  const message =
                    error?.response?.data?.messages?.[0] ||
                    error?.response?.data?.message ||
                    'Error creating user';
                  enqueueSnackbar(message, { variant: 'error' });
                }
              }}
            />
          </CardContent>
        </Card>
      </Box>
    </>
  );
};
