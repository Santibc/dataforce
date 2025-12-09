import { Box, Card, CardContent } from '@mui/material';
import { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetLoggedUserQuery } from 'src/api/AuthRepository';
import { useFindUserQuery, useUpdateUserMutation } from 'src/api/usersRepository';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { APP_NAME } from 'src/config';
import { PATHS } from 'src/routes/paths';
import { LoadingComponent } from 'src/utils/LoadingComponent';
import { UserForm } from '../UserForm';

interface EditUserPageProps {}

export const EditUserPage: FC<EditUserPageProps> = (props) => {
  const { mutateAsync: updateUser } = useUpdateUserMutation();
  const navigate = useNavigate();
  const { data: user } = useGetLoggedUserQuery();
  const { id } = useParams<{ id: string }>();
  const { data: userData, isFetching: isUserDataFetching } = useFindUserQuery(Number(id));
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
            <LoadingComponent isFetching={isUserDataFetching}>
              {userData !== undefined && (
                <UserForm
                  initialValues={
                    userData === undefined
                      ? undefined
                      : {
                          ...userData,
                          positions_id: userData.positions.map((pos) => pos.id),
                          jobsites_id: userData.jobsites.map((job) => job.id),
                        }
                  }
                  onSubmit={async (vals) => {
                    await updateUser({ ...vals, company_id, id: Number(id) });
                    navigate(PATHS.dashboard.users.list);
                  }}
                  edit
                />
              )}
            </LoadingComponent>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};
