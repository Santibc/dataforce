import { IconButton, MenuItem, Typography, Box } from '@mui/material';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  HitDataGridFilterResetButton,
  HitDatagrid,
  HitDatagridFilterSubmitButton,
  useColumns,
} from 'src/components/datagrid';
import { HitFormActions, HitFormGrid, HitTextField } from 'src/components/form';

import Iconify from 'src/components/iconify';
import MenuPopover from 'src/components/menu-popover';
import { useConfirm } from 'src/components/confirm-action/ConfirmAction';
import { IRecievedJobsite } from 'src/api/jobsitesRepository';

interface Props {
  data: IRecievedJobsite[];
  isLoading: boolean;
  onDelete: (id: number) => any;
  onEdit: (id: number) => any;
  onSelectUniversidad: (id: number) => any;
}

export const JobsitesTable: React.FC<Props> = ({
  data,
  isLoading,
  onDelete,
  onEdit,
  onSelectUniversidad,
}) => {
  const hf = useForm();
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
  const selectedIdRef = useRef<number | undefined>();
  const confirm = useConfirm();

  const columns = useColumns<(typeof data)[0]>([
    {
      field: 'name',
      headerName: 'Name',
      type: 'string',
    },
    {
      field: 'address_street',
      headerName: 'Address',
      type: 'string',
    },
    {
      field: 'state',
      headerName: 'State',
      type: 'string',
    },
    {
      field: 'city',
      headerName: 'City',
      type: 'string',
    },
    {
      field: 'zip_code',
      headerName: 'Zip Code',
      type: 'string',
    },
    {
      field: 'action',
      headerName: 'Actions',
      type: 'actions',
      renderCell: (params) => (
        <>
          <IconButton
            onClick={(e) => {
              selectedIdRef.current = Number(params.id);
              setOpenPopover(e.currentTarget);
            }}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </>
      ),
    },
  ]);

  return (
    <Box>
      <HitDatagrid
        filter={{
          hf,
          render: (
            <HitFormGrid>
              <Controller
                name="name"
                render={(field) => <HitTextField {...field} label="Name" />}
              />
              <HitFormActions>
                <HitDataGridFilterResetButton />
                <HitDatagridFilterSubmitButton />
              </HitFormActions>
            </HitFormGrid>
          ),
        }}
        rows={data}
        columns={columns}
        onRowSelectionModelChange={(model) => onSelectUniversidad(Number(model[0]))}
      />

      <MenuPopover
        open={openPopover}
        onClose={() => {
          setOpenPopover(null);
          selectedIdRef.current = undefined;
        }}
        arrow="right-top"
      >
        <MenuItem
          onClick={() => {
            setOpenPopover(null);
            confirm({
              action: async () => onDelete(selectedIdRef.current!),
              content: 'Are you sure you want to delete this jobsite?',
            });
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            setOpenPopover(null);
            onEdit(selectedIdRef.current!);
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>
      </MenuPopover>
    </Box>
  );
};
