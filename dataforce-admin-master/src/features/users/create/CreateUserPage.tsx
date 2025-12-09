import { Box, Card, CardContent } from '@mui/material';
import { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import { useGetLoggedUserQuery } from 'src/api/AuthRepository';
import { useCreateUserMutation } from 'src/api/usersRepository';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { APP_NAME } from 'src/config';
import { PATHS } from 'src/routes/paths';
import { UserForm } from '../UserForm';

interface CreateUserPageProps {}

export const CreateUserPage: FC<CreateUserPageProps> = (props) => {
  const { mutateAsync: createUser } = useCreateUserMutation();
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
                await createUser({ ...vals, company_id });
                navigate(PATHS.dashboard.users.list);
              }}
            />
          </CardContent>
        </Card>
      </Box>
    </>
  );
};
