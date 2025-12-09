import { Box, IconButton, MenuItem } from '@mui/material';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { IRecievedCompanies } from 'src/api/superAdminRepository';
import { chainConfirm } from 'src/components/confirm-action-chain/chainConfirm';
import { useConfirm } from 'src/components/confirm-action/ConfirmAction';
import {
  HitDataGridFilterResetButton,
  HitDatagrid,
  HitDatagridFilterSubmitButton,
  useColumns,
} from 'src/components/datagrid';
import { HitFormActions, HitFormGrid, HitTextField } from 'src/components/form';
import Iconify from 'src/components/iconify';
import MenuPopover from 'src/components/menu-popover';

interface SuperAdminCompaniesTableProps {
  data: IRecievedCompanies[];
  onDelete: (id: number) => any;
  onEdit: (id: number) => any;
  onSelectRow: (id: number) => any;
  onInspectCompany: (id: number) => any;
}

export const SuperAdminCompaniesTable: React.FC<SuperAdminCompaniesTableProps> = ({
  data,
  onDelete,
  onEdit,
  onSelectRow,
  onInspectCompany,
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
      maxWidth: 300,
    },
    {
      field: 'address',
      headerName: 'Address',
      type: 'string',
      maxWidth: 1000,
    },
    {
      field: 'driver_amount',
      headerName: 'Driver Amount',
      type: 'string',
      maxWidth: 150,
    },
    {
      field: 'fleat_size',
      headerName: 'Fleat Size',
      type: 'string',
      maxWidth: 150,
    },
    {
      field: 'payroll',
      headerName: 'Payroll',
      type: 'string',
      maxWidth: 150,
    },
    {
      field: 'action',
      headerName: ' ',
      type: 'actions',
      maxWidth: 50,
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
        onRowSelectionModelChange={(model) => onSelectRow(Number(model[0]))}
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
            chainConfirm(confirm, [
              {
                content: 'Are you sure you want to delete this company?',
                actionLabel: 'Yes',
              },
              {
                content:
                  "Are you REALLY sure you want to delete this company? This will affect the company's whole system",
                actionLabel: 'Yes',
              },
              {
                content:
                  "This action is irreversible and the company's data cannot be recovered. Do you still want to procceed?",
                action: async () => onDelete(selectedIdRef.current!),
                actionLabel: 'Yes',
              },
            ]);
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            setOpenPopover(null);
            chainConfirm(confirm, [
              {
                content: 'Are you sure you want to edit this company?',
                actionLabel: 'Yes',
              },
              {
                content:
                  "Are you REALLY sure you want to edit this company? This will affect the company's whole system",
                action: async () => onEdit(selectedIdRef.current!),
                actionLabel: 'Yes',
              },
            ]);
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenPopover(null);
            onInspectCompany(selectedIdRef.current!);
          }}
        >
          <Iconify icon="eva:eye-fill" />
          Inspect company
        </MenuItem>
      </MenuPopover>
    </Box>
  );
};
