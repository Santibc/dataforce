import { Box, Button, Typography } from '@mui/material';
import { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  IRecievedPosition,
  useAllPositionsQuery,
  useCreatePositionMutation,
  useDeletePositionMutation,
  useUpdatePositionMutation,
} from 'src/api/positionsRepository';
import { IslandModal } from 'src/components/island-modal/IslandModal';
import { APP_NAME } from 'src/config';
import useFormHandle from 'src/hooks/useFormHandle';
import { NewPositionForm } from './NewPositionForm';
import { PositionsTable } from './PositionsTable';

interface PositionsPageProps {}

export const PositionsPage: FC<PositionsPageProps> = (props) => {
  const { mutateAsync: createPosition } = useCreatePositionMutation();
  const { mutateAsync: editPosition } = useUpdatePositionMutation();
  const { mutateAsync: deletePosition } = useDeletePositionMutation();
  const { isEditing, isCreating, editingData, create, edit, close } =
    useFormHandle<IRecievedPosition>();

  const { data: positionsData, isFetching: isPositionsFetching } = useAllPositionsQuery();
  return (
    <>
      <Helmet>
        <title> Positions | {APP_NAME}</title>
      </Helmet>
      <Box
        sx={{
          paddingX: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: '2.5rem',
          }}
        >
          <Typography variant="h3">Positions</Typography>
          <Button variant="contained" onClick={create}>
            Create New Position
          </Button>
        </Box>
        <Box>
          <PositionsTable
            data={[...(positionsData || [])]}
            isLoading={isPositionsFetching}
            onDelete={(id) => {
              if (positionsData === undefined) return;
              const found = positionsData.find((data) => data.id === id);
              if (found !== undefined) return deletePosition(found.id);
            }}
            onEdit={(id) => {
              if (positionsData === undefined) return;
              const found = positionsData.find((data) => data.id === id);
              if (found !== undefined) edit(found);
            }}
            onSelectUniversidad={() => {}}
          />
        </Box>
      </Box>
      {isCreating && (
        <IslandModal open={isCreating} onClose={close} maxWidth="600px">
          <NewPositionForm
            onSubmit={async (values) => {
              console.log(
                '🚀 ~ file: PositionsPage.tsx:125 ~ <NewPositionFormonSubmit={ ~ values:',
                values
              );
              await createPosition({
                ...values,
                from: values.from!,
                to: values.to!,
              });
              close();
            }}
            onClose={close}
          />
        </IslandModal>
      )}
      {isEditing && (
        <IslandModal open={isEditing} onClose={close} maxWidth="600px">
          <NewPositionForm
            initialValues={editingData ? editingData : undefined}
            onSubmit={async (values) => {
              await editPosition({
                ...values,
                from: values.from!,
                to: values.to!,
              });
              close();
            }}
            edit
            onClose={close}
          />
        </IslandModal>
      )}
    </>
  );
};
