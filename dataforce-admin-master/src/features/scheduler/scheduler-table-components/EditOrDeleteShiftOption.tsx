import { Box, Button, Chip, Divider, Modal, Paper, Typography } from '@mui/material';
import moment from 'moment';
import { FC } from 'react';
import { FaTrash } from 'react-icons/fa';
import { HiPencil } from 'react-icons/hi';
import { IoMdClose } from 'react-icons/io';
import { IRecievedPosition } from 'src/api/positionsRepository';
import { ScheduleShiftForDelete } from 'src/api/scheduleJobsiteRepository';
import {
  useDeleteShiftMutation,
  usePublishShiftMutation,
  useUpdateShiftMutation,
} from 'src/api/shiftRepository';
import { useConfirm } from 'src/components/confirm-action/ConfirmAction';
import { NewPositionForm } from 'src/features/positions/NewPositionForm';
import { getAmPmFromDateString } from 'src/features/positions/PositionsTable';
import useFormHandle from 'src/hooks/useFormHandle';

interface EditOrDeleteShiftOptionProps {
  shift: ScheduleShiftForDelete;
  onClose: () => void;
  jobsite_id: number;
}

export const EditOrDeleteShiftOption: FC<EditOrDeleteShiftOptionProps> = ({
  onClose,
  shift,
  jobsite_id,
}) => {
  const { mutateAsync: editShift } = useUpdateShiftMutation();
  const publishMutation = usePublishShiftMutation();
  const deleteShiftMutation = useDeleteShiftMutation();
  const { isEditing, editingData, edit: editForm, close } = useFormHandle<IRecievedPosition>();

  const confirm = useConfirm();

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
            Edit Shift for {shift.user.name} on {moment(shift.from).format('ddd MMM Do')}
          </Typography>
          <IoMdClose size={20} color="#637381" onClick={onClose} cursor="pointer" />
        </Box>
        <Divider sx={{ height: 1, width: 1 }} />
        <Box sx={{ py: 5, width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box
            key={shift.id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box display="flex" justifyContent="center" alignItems="center">
              <Typography variant="h6">{getAmPmFromDateString(shift.from)} - </Typography>
              <Typography ml={0.4} variant="h6">
                {getAmPmFromDateString(shift.to)}{' '}
              </Typography>
              <Chip
                label={shift.name}
                sx={{
                  background: shift.color,
                  ml: 2,
                  color: 'white',
                  fontSize: 15,
                  fontWeight: 700,
                  borderRadius: 1,
                }}
              />
            </Box>
            <Box display="flex" gap={1}>
              <Button variant="text" onClick={() => editForm(shift)}>
                <HiPencil size={23} color="#212b36" />
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  confirm({
                    action: async () => {
                      await deleteShiftMutation.mutateAsync(shift.id);
                      onClose();
                    },
                    content: 'Are you sure you want to delete this shift?',
                  });
                }}
              >
                <FaTrash />
              </Button>
            </Box>
          </Box>
        </Box>
        <Box display={'flex'} width={'100%'} justifyContent={'flex-end'}>
          <Button
            variant="contained"
            disabled={shift.published}
            sx={{
              ':hover': { color: 'none', boxShadow: 'none' },
              color: 'white',
              fontSize: '14px',
            }}
            onClick={async () => {
              await publishMutation.mutateAsync(shift.id);
              onClose();
            }}
          >
            Publish & Notify
          </Button>
        </Box>
      </Box>
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
            onSubmit={async (values) => {
              await editShift({
                ...values,
                from: values.from!,
                to: values.to!,
                user_id: shift.user.id,
                jobsite_id,
              });
              close();
              onClose();
            }}
            isShift={true}
            edit
          />
        </Paper>
      </Modal>
    </>
  );
};
