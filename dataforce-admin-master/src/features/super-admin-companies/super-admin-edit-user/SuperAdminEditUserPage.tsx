import { Box } from '@mui/material';
import { FC } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  useSuperAdminGetUserQuery,
  useSuperAdminUpdateUserMutation,
} from 'src/api/superAdminRepository';
import { UserForm } from 'src/features/users/UserForm';
import { LoadingComponent } from 'src/utils/LoadingComponent';

interface SuperAdminEditUserPageProps {}

export const SuperAdminEditUserPage: FC<SuperAdminEditUserPageProps> = (props) => {
  const { mutateAsync: updateUser } = useSuperAdminUpdateUserMutation();
  const { id } = useParams<{ id: string }>();
  const { data: userData, isFetching: isUserDataFetching } = useSuperAdminGetUserQuery(Number(id));
  const [searchParams] = useSearchParams();
  const company_id = searchParams.get('company_id');
  return (
    <Box
      sx={{
        paddingX: 3,
      }}
    >
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
              await updateUser({ ...vals, company_id: Number(company_id), id: Number(id) });
              window.history.back();
            }}
            edit
          />
        )}
      </LoadingComponent>
    </Box>
  );
};
