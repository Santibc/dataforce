import { IconButton, MenuItem, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import moment from 'moment';
import { FC, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  HitDataGridFilterResetButton,
  HitDatagrid,
  HitDatagridFilterSubmitButton,
  useColumns,
} from 'src/components/datagrid';
import { HitFormActions, HitFormGrid, HitTextField } from 'src/components/form';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import MenuPopover from 'src/components/menu-popover';
import { useConfirm } from 'src/components/confirm-action/ConfirmAction';
import { IDailyLog } from 'src/api/dailyLogRepository';
import {
  EVENT_TYPE_LABEL_MAP,
  EVENT_TYPE_OPTIONS,
  SEVERITY_COLOR_MAP,
  SEVERITY_LABEL_MAP,
  SEVERITY_OPTIONS,
  STATUS_COLOR_MAP,
} from './dailyLogConstants';

interface DailyLogTableProps {
  data: IDailyLog[];
  isLoading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onSubmit: (id: number) => void;
  onView: (id: number) => void;
}

export const DailyLogTable: FC<DailyLogTableProps> = ({
  data,
  isLoading,
  onEdit,
  onDelete,
  onSubmit,
  onView,
}) => {
  const hf = useForm({
    defaultValues: { driver_name: '', event_type: '', severity: '' },
  });
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
  const selectedIdRef = useRef<number | undefined>();
  const onViewRef = useRef(onView);
  onViewRef.current = onView;
  const confirm = useConfirm();

  const tableData = data.map((row) => ({
    ...row,
    date_formatted: moment(row.date).format('MM/DD/YYYY'),
    event_type_label: EVENT_TYPE_LABEL_MAP[row.event_type] || row.event_type,
    severity_label: SEVERITY_LABEL_MAP[row.severity] || row.severity,
    status_label: row.status === 'submitted' ? 'Submitted' : 'Draft',
  }));

  const columns = useColumns<(typeof tableData)[0]>([
    {
      field: 'date_formatted',
      headerName: 'Date',
      type: 'string',
      flex: 0.8,
    },
    {
      field: 'driver_name',
      headerName: 'Driver',
      type: 'string',
      flex: 1,
    },
    {
      field: 'event_type_label',
      headerName: 'Event Type',
      type: 'string',
      flex: 1,
      renderCell: (params) => (
        <Label variant="soft" color="primary">
          {params.value}
        </Label>
      ),
    },
    {
      field: 'severity_label',
      headerName: 'Severity',
      type: 'string',
      flex: 0.7,
      renderCell: (params) => (
        <Label
          variant="soft"
          color={SEVERITY_COLOR_MAP[params.row.severity] || 'default'}
        >
          {params.value}
        </Label>
      ),
    },
    {
      field: 'status_label',
      headerName: 'Status',
      type: 'string',
      flex: 0.7,
      renderCell: (params) => (
        <Label
          variant="soft"
          color={STATUS_COLOR_MAP[params.row.status] || 'default'}
        >
          {params.value}
        </Label>
      ),
    },
    {
      field: 'admin_name',
      headerName: 'Admin',
      type: 'string',
      flex: 1,
    },
    {
      field: 'action',
      headerName: 'Actions',
      type: 'string',
      flex: 0.5,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          {params.row.status === 'draft' ? (
            <IconButton
              onClick={(e) => {
                selectedIdRef.current = Number(params.id);
                setOpenPopover(e.currentTarget);
              }}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          ) : (
            <IconButton onClick={() => onViewRef.current(Number(params.id))}>
              <Iconify icon="eva:eye-fill" />
            </IconButton>
          )}
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
                name="driver_name"
                render={(field) => <HitTextField {...field} label="Driver" />}
              />
              <Controller
                name="event_type"
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    label="Event Type"
                    value={field.value}
                    onChange={field.onChange}
                    size="small"
                  >
                    <MenuItem value="">All</MenuItem>
                    {EVENT_TYPE_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.label}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="severity"
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    label="Severity"
                    value={field.value}
                    onChange={field.onChange}
                    size="small"
                  >
                    <MenuItem value="">All</MenuItem>
                    {SEVERITY_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.label}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <HitFormActions>
                <HitDataGridFilterResetButton />
                <HitDatagridFilterSubmitButton />
              </HitFormActions>
            </HitFormGrid>
          ),
        }}
        rows={tableData}
        columns={columns}
        loading={isLoading}
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
            onEdit(selectedIdRef.current!);
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            setOpenPopover(null);
            confirm({
              action: async () => onSubmit(selectedIdRef.current!),
              title: 'Submit Daily Log',
              content: 'Are you sure you want to submit this log? This will send an email to the driver and cannot be undone.',
              actionLabel: 'Submit',
            });
          }}
        >
          <Iconify icon="eva:paper-plane-fill" />
          Submit & Send
        </MenuItem>

        <MenuItem
          onClick={() => {
            setOpenPopover(null);
            confirm({
              action: async () => onDelete(selectedIdRef.current!),
              content: 'Are you sure you want to delete this daily log?',
            });
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>
    </Box>
  );
};
