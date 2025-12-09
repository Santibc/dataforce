import { LoadingButton } from '@mui/lab';
import { Box, Button, FormLabel } from '@mui/material';
import { useState } from 'react';
import { IRecievedUser } from 'src/api/usersRepository';
import { HitFormActions } from 'src/components/form';
import { UsersTable } from 'src/features/users/UsersTable';

interface Props {
  usersData: IRecievedUser[];
  onBack: () => void;
  onSubmit: (userIds: number[]) => Promise<void>;
  isLoading: boolean;
  initialValues?: number[];
}

const NewJobsiteUsersForm = ({ usersData, onBack, onSubmit, isLoading, initialValues }: Props) => {
  const [userIds, setUserIds] = useState<number[]>(initialValues ?? []);
  const [error, setError] = useState<string>();

  const handleSubmit = () => {
    if (userIds.length < 1) return setError('You must select at least one user.');
    setError(undefined);
    onSubmit(userIds);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <h2>Users</h2>
      <UsersTable
        data={usersData || []}
        isLoading={false}
        onDelete={() => {}}
        hideActions={true}
        onEdit={(id) => {
          /*           const found = mockData.find((data) => data.id === id);
          console.log(found);
          if (found !== undefined) edit(found); */
        }}
        onSelectedModels={(models) => {
          setError(undefined);
          setUserIds(models);
        }}
        selectedRowIds={userIds || []}
      />
      <FormLabel error>{error ? error : null}</FormLabel>

      <Box sx={{ width: '100%', marginTop: 2 }}>
        <HitFormActions>
          <Button variant="outlined" disabled={isLoading} onClick={onBack}>
            Back
          </Button>
          <LoadingButton
            onClick={handleSubmit}
            disabled={isLoading}
            loading={isLoading}
            variant="contained"
            type="button"
          >
            Save
          </LoadingButton>
        </HitFormActions>
      </Box>
    </Box>
  );
};

export default NewJobsiteUsersForm;
