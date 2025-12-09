import { Box, Button, Chip, Divider, Modal, Paper, Typography } from '@mui/material';
import moment from 'moment';
import { FC } from 'react';
import { FaPlus } from 'react-icons/fa';
import { HiPencil } from 'react-icons/hi';
import { IoMdClose } from 'react-icons/io';
import { IRecievedPosition, useAllPositionsQuery } from 'src/api/positionsRepository';
import { useCreateShiftMutation } from 'src/api/shiftRepository';
import { NewPositionFields, NewPositionForm } from 'src/features/positions/NewPositionForm';
import { getAmPmFromDateString } from 'src/features/positions/PositionsTable';
import useFormHandle from 'src/hooks/useFormHandle';
import { getFechaByPosition } from 'src/utils/getFechaByPosition';

interface ShiftOptionsProps {
  user: {
    name: string;
    id: number;
  };
  jobsite_id: number;
  time: string;
  edit?: boolean;
  onClose: () => void;
}

export const ShiftOptions: FC<ShiftOptionsProps> = ({
  onClose,
  user,
  jobsite_id,
  time,
  edit = false,
}) => {
  const {
    isEditing,
    isCreating,
    editingData,
    create,
    edit: editForm,
    close,
  } = useFormHandle<IRecievedPosition>();

  const { data: positionsData } = useAllPositionsQuery();
  const { mutateAsync: createShift } = useCreateShiftMutation();

  const onSubmit = async (values: NewPositionFields) => {
    await createShift({
      ...values,
      from: getFechaByPosition(moment(values.from), moment(time)),
      to: getFechaByPosition(moment(values.to), moment(time)),
      user_id: user.id,
      jobsite_id,
    });
    close();
    onClose();
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        width="100%"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          pb="1rem"
          width="100%"
        >
          <Typography variant="h4">
            {edit ? 'Edit' : 'Create'} Shift for {user.name} on {moment(time).format('ddd MMM Do')}
          </Typography>
          <IoMdClose size={20} color="#637381" onClick={onClose} cursor="pointer" />
        </Box>
        <Divider sx={{ height: 1, width: 1 }} />
        <Box sx={{ py: 5, width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {positionsData &&
            positionsData.map((position) => (
              <Box
                key={position.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Typography variant="h6">{getAmPmFromDateString(position.from)} - </Typography>
                  <Typography ml={0.4} variant="h6">
                    {getAmPmFromDateString(position.to)}{' '}
                  </Typography>
                  <Chip
                    label={position.name}
                    sx={{
                      background: position.color,
                      ml: 2,
                      color: 'white',
                      fontSize: 15,
                      fontWeight: 700,
                      borderRadius: 1,
                    }}
                  />
                </Box>
                <Box display="flex" gap={1}>
                  <Button variant="text" onClick={() => editForm(position)}>
                    <HiPencil size={23} color="#212b36" />
                  </Button>
                  <Button
                    variant="contained"
                    onClick={async () => {
                      await createShift({
                        color: position.color,
                        from: getFechaByPosition(moment(position.from), moment(time)),
                        to: getFechaByPosition(moment(position.to), moment(time)),
                        jobsite_id,
                        name: position.name,
                        user_id: user.id,
                      });
                      onClose();
                    }}
                  >
                    <FaPlus />
                  </Button>
                </Box>
              </Box>
            ))}
        </Box>
        <Divider sx={{ height: 1, width: 1 }} />
        <Box pt="2rem" display="flex" justifyContent="flex-start" alignItems="center" width="100%">
          <Button variant="contained" onClick={create}>
            Create custom shift
          </Button>
        </Box>
      </Box>
      <Modal
        open={isCreating}
        onClose={close}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper
          sx={{
            width: '600px',
            padding: 5,
          }}
        >
          <NewPositionForm onClose={close} onSubmit={onSubmit} />
        </Paper>
      </Modal>
      <Modal
        open={isEditing}
        onClose={close}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper
          sx={{
            width: '600px',
            padding: 5,
          }}
        >
          <NewPositionForm
            initialValues={editingData ? editingData : undefined}
            onSubmit={onSubmit}
            edit
          />
        </Paper>
      </Modal>
    </>
  );
};
