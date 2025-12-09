import {
  Box,
  Button,
  MenuItem,
  Modal,
  Paper,
  Popover,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import moment from 'moment';
import React, { FC, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FiMoreVertical } from 'react-icons/fi';
import { FaRegCopy } from "react-icons/fa";
import {
  IoChevronBackOutline,
  IoChevronDownOutline,
  IoChevronForward,
  IoFilter,
  IoWarning,
} from 'react-icons/io5';
import { MdEvent } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import {
  IRecievedScheduleJobsite,
  ScheduleShift,
  ScheduleShiftForDelete,
  useAllScheduleJobsitesQuery,
  useCleancheduleJobsiteMutation,
} from 'src/api/scheduleJobsiteRepository';
import { Overlay } from 'src/components/overlay/Overlay';
import useFormHandle from 'src/hooks/useFormHandle';
import { CopyPrevWeekOptions } from './scheduler-table-components/CopyPrevWeekOptions';
import { PopoverButton } from './scheduler-table-components/PopoverButton';
import { ScheduleFilters, deserializeArr } from './scheduler-table-components/ScheduleFilters';
import { ShiftOptions } from './scheduler-table-components/ShiftOptions';
import { ShiftTableDisplay } from './scheduler-table-components/ShiftTableDisplay';
import { UserTableCheckbox } from './scheduler-table-components/UserTableCheckbox';
import { getAmPmFromDateString } from '../positions/PositionsTable';
import { getDateForHeaderSchedule, getEndOfWeek, getStartOfWeek, getToday } from 'src/utils/getFechaByPosition';
import { EditOrDeleteShiftOption } from './scheduler-table-components/EditOrDeleteShiftOption';
import { IRecievedJobsite, useAllJobsitesQuery } from 'src/api/jobsitesRepository';
import { IRecievedPosition, useAllPositionsQuery } from 'src/api/positionsRepository';
import { IRecievedUser } from 'src/api/usersRepository';
import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config';
import { useCopyShiftMutation, useDeleteUserShiftMutation, usePublishAllShiftMutation } from 'src/api/shiftRepository';
import { useConfirm } from 'src/components/confirm-action/ConfirmAction';
import { getCantidadHorasByColumn } from 'src/utils/getCantidadHorasByColumn';
import { hexToRgb, rgbToRgbaString } from 'src/utils/hexToRgb';
import { exportToXLSX } from 'src/utils/exportXlsxTemplate';
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf';

interface SchedulerPageProps {
  jobsites: IRecievedJobsite[],
  positions: IRecievedPosition[],
  users: IRecievedUser[]
}

export interface FiltersFormFields {
  user: string;
  position: string[];
  jobsite: string;
  hideunscheduled: boolean;
}

const SCHEDULE_TIMEFRAME = {
  DAY: 'day',
  WEEK: 'week',
  TWO_WEEKS: 'two weeks',
} as const;

export const PARAM_KEYS = {
  SCHEDULE_TIMEFRAME: 'schedule-timeframe',
  DATE: 'date',
  FILTERS_JOBSITE: 'filters-jobsite',
  FILTERS_USER: 'filters-user',
  FILTERS_POSITION: 'filters-position',
  FILTERS_HIDE_UNSCHEDULED: 'filters-hide-unscheduled',
} as const;

const daysInTimeframe = {
  [SCHEDULE_TIMEFRAME.DAY]: 1,
  [SCHEDULE_TIMEFRAME.WEEK]: 7,
  [SCHEDULE_TIMEFRAME.TWO_WEEKS]: 14,
} as const;

const HOURS_WORKED = {
  [SCHEDULE_TIMEFRAME.DAY]: 8,
  [SCHEDULE_TIMEFRAME.WEEK]: 40,
  [SCHEDULE_TIMEFRAME.TWO_WEEKS]: 80,
} as const;

function getTimelineHeaders(date: string, days: number): string[] {
  if (days < 0)
    return getTimelineHeaders(moment(date).subtract(days, 'days').format(), Math.abs(days));
  const headers = [];
  for (let index = 0; index < days; index++) {
    headers.push(moment(date).add(index, 'days').format());
  }
  return headers;
}

export const SchedulerPage: FC<SchedulerPageProps> = ({
  positions,
  jobsites,
  users
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const [openCopyPrevWeek, setOpenCopyPrevWeek] = React.useState(false);
  const [userIdSelected, setUserIdSelected] = React.useState<number | undefined>(undefined);
  const { isEditing, editingData, edit, close } = useFormHandle<{
    cellDate: string;
    userData: IRecievedScheduleJobsite;
  }>();

  const confirm = useConfirm();
  const publishAllMutation = usePublishAllShiftMutation()

  const copyMutation = useCopyShiftMutation()

  const [editData, setEditData] = useState<ScheduleShiftForDelete | null>(null);

  const [searchParams, setSearchParams] = useSearchParams({
    [PARAM_KEYS.SCHEDULE_TIMEFRAME]: SCHEDULE_TIMEFRAME.WEEK,
    [PARAM_KEYS.DATE]: moment().format(),
    [PARAM_KEYS.FILTERS_JOBSITE]: `${jobsites[0].id}`,
    [PARAM_KEYS.FILTERS_USER]: '0',
    [PARAM_KEYS.FILTERS_POSITION]: 'All',
    [PARAM_KEYS.FILTERS_HIDE_UNSCHEDULED]: 'false',
  });

  const filtersPosition = deserializeArr(searchParams.get(PARAM_KEYS.FILTERS_POSITION) || 'All');
  const filtersUsers = searchParams.get(PARAM_KEYS.FILTERS_USER);
  const filtersHideOnSchedule = searchParams.get(PARAM_KEYS.FILTERS_HIDE_UNSCHEDULED);
  const filtersJobsite = searchParams.get(PARAM_KEYS.FILTERS_JOBSITE);
  const [filtersSelectedDrivers, setFiltersSelectedDrivers] = React.useState(false);

  const getValueUser = (value: string) => {
    const user = users.filter(x => `${x.id}` == value);
    if (user.length > 0) {
      return `${user[0].id}`;
    }
    return 'All';
  }

  const hf = useForm<FiltersFormFields>({
    mode: 'onBlur',
    defaultValues: {
      jobsite: `${jobsites[0].id}`,
      user: 'All',
      position: ['All'],
      hideunscheduled: false
    },
    values: {
      jobsite: filtersJobsite === null || filtersJobsite === '0' ? `${jobsites[0].id}` : filtersJobsite,
      user: filtersUsers === null || filtersUsers === '0' ? 'All' : getValueUser(filtersUsers),
      position: filtersPosition === null || filtersPosition.length === 0 ? ['All'] : filtersPosition,
      hideunscheduled: filtersHideOnSchedule !== null && filtersHideOnSchedule === 'true'
    },
  });

  // Having selectedDrivers in hf and changing filter values resets selectedDrivers
  const hfSelectedDrivers = useForm<{
    selectedDrivers: { driverId: number; checked: boolean; }[];
  }>({
    mode: 'onBlur',
    defaultValues: {
      selectedDrivers: [],
    },
    values: {
      selectedDrivers: []
    }
  });
  const { fields, append, remove } = useFieldArray({
    control: hfSelectedDrivers.control,
    name: "selectedDrivers",
  });

  function navigateDays(days: number) {
    setSearchParams(
      (prev) => {
        prev.set(
          PARAM_KEYS.DATE,
          moment(prev.get(PARAM_KEYS.DATE) || '')
            .add(days, 'days')
            .format()
        );
        return prev;
      },
      { replace: true }
    );
  }
  const currentTimeframe =
    daysInTimeframe[
    searchParams.get(PARAM_KEYS.SCHEDULE_TIMEFRAME) as keyof typeof daysInTimeframe
    ];

  const { data: scheduleJobsitesData, isLoading: isScheduleJobsitesDataLoading } = useAllScheduleJobsitesQuery({
    jobsite_id: filtersJobsite === null ? `${jobsites[0].id}` : filtersJobsite,
    from_datetime: searchParams.get(PARAM_KEYS.SCHEDULE_TIMEFRAME) === 'day'
      ? moment(searchParams.get(PARAM_KEYS.DATE)).set({ hour: 0, minute: 0, second: 0 }).format('YYYY-MM-DD HH:mm:ss')
      : getStartOfWeek(moment(searchParams.get(PARAM_KEYS.DATE)).set({ hour: 0, minute: 0, second: 0 })),
    to_datetime: searchParams.get(PARAM_KEYS.SCHEDULE_TIMEFRAME) === 'day'
      ? moment(searchParams.get(PARAM_KEYS.DATE)).set({ hour: 23, minute: 59, second: 59 }).format('YYYY-MM-DD HH:mm:ss')
      : getEndOfWeek(
        moment(searchParams.get(PARAM_KEYS.DATE)).set({ hour: 23, minute: 59, second: 59 }),
        searchParams.get(PARAM_KEYS.SCHEDULE_TIMEFRAME) === 'two weeks'
          ? 1
          : 0,
      ),
    name_positions: filtersPosition === undefined || filtersPosition === null
      ? undefined
      : filtersPosition!,
    users_id: filtersUsers === '0' || filtersUsers === null
      ? undefined
      : filtersUsers!,
  });

  const timelineHeaders = getTimelineHeaders(
    searchParams.get(PARAM_KEYS.SCHEDULE_TIMEFRAME) === SCHEDULE_TIMEFRAME.DAY
      ? getToday(moment(searchParams.get(PARAM_KEYS.DATE)).set({ hour: 0, minute: 0, second: 0 }))
      : getStartOfWeek(moment(searchParams.get(PARAM_KEYS.DATE)).set({ hour: 0, minute: 0, second: 0 })) || '',
    currentTimeframe
  );

  const deleteUsersShiftMutation = useDeleteUserShiftMutation();

  const data = (scheduleJobsitesData ?? []).map((row) => {
    if (searchParams.get(PARAM_KEYS.FILTERS_HIDE_UNSCHEDULED) !== null
      && searchParams.get(PARAM_KEYS.FILTERS_HIDE_UNSCHEDULED) === 'true'
      && row.shifts.length === 0
    ) {
      return null;
    }
    const completedShifts: ScheduleShift[] = Array.from({ length: currentTimeframe });
    row.shifts.forEach((shift) => {
      const day = moment(shift.from).format('DD');
      const index = timelineHeaders.findIndex((header) => moment(header).format('DD') === day);
      completedShifts[index] = shift;
    });
    return {
      ...row,
      completedShifts,
    };
  });

  function selectedDriversRowFilter(row: IRecievedScheduleJobsite) {
    // If the filter is disabled always return true
    if (!filtersSelectedDrivers) return true;
    if (fields.filter(field => field.driverId === row.id).length > 0) {
      return true;
    }
    return false;
  }

  const haveNotPublished = () => {
    let notPublishedCount = 0;
    data.map(x => {
      if (x && x.shifts.length > 0) {
        x.shifts.map(y => {
          if (!y.published) {
            notPublishedCount++;
          }
        })
      }
    })
    return notPublishedCount === 0;
  }

  const usersInJobsite = users.filter(x => x.jobsites.some(x => x.id === Number(filtersJobsite)));

  const cleanScheduleMutation = useCleancheduleJobsiteMutation();

  const obtenerCantidadHoras = () => {
    let contador = 0;
    data.forEach(x => {
      if (x?.cantidad_horas)
        contador += x?.cantidad_horas;
    })
    return contador;
  }

  const isConflicto = (index: number) => {
    return data.some(item =>
      item !== null &&
      item.preferences.filter(x => x.date.format('ddd D') === moment(timelineHeaders[index]).format('ddd D')).length > 0 &&
      item.shifts.filter(y => y.published && !y.delete_after_published).filter(x => x.from.format('ddd D') === moment(timelineHeaders[index]).format('ddd D')).length > 0
    );
  }

  return (
    <Box
      sx={{
        paddingX: 3,
      }}
    >
      <Helmet>
        <title> Schedule | {APP_NAME}</title>
      </Helmet>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '2.5rem',
        }}
      >
        <Typography variant="h4">Schedule</Typography>
        <Button
          variant="contained"
          disabled={haveNotPublished()}
          sx={{
            ':hover': { color: 'none', boxShadow: 'none' },
            color: 'white',
            fontSize: '14px',
          }}
          onClick={async () => {
            confirm({
              actionLabel: 'Publish',
              color: 'primary',
              action: async () => {
                const positions = searchParams.get(PARAM_KEYS.FILTERS_POSITION);
                const user = searchParams.get(PARAM_KEYS.FILTERS_USER);
                const notUser = user === null || user === '' || user === 'All'
                const notPosition = positions === null || positions === '' || positions === 'All'
                const date = searchParams.get(PARAM_KEYS.DATE);
                const isDay = searchParams.get(PARAM_KEYS.SCHEDULE_TIMEFRAME) === 'day'
                await publishAllMutation.mutateAsync({
                  from: isDay
                    ? moment(date).set({ hour: 0, minute: 0, second: 0 }).format('YYYY-MM-DD HH:MM:SS')
                    : getStartOfWeek(moment(date).set({ hour: 0, minute: 0, second: 0 })),
                  to: isDay
                    ? moment(date).set({ hour: 23, minute: 59, second: 59 }).format('YYYY-MM-DD HH:MM:SS')
                    : getEndOfWeek(
                      moment(date).set({ hour: 23, minute: 59, second: 59 }),
                      searchParams.get(PARAM_KEYS.SCHEDULE_TIMEFRAME) === 'two weeks'
                        ? 1
                        : 0
                    ),
                  jobsite_id: filtersJobsite === null ? jobsites[0].id : Number(filtersJobsite),
                  names: notPosition ? undefined : searchParams.get(PARAM_KEYS.FILTERS_POSITION)!.split(','),
                  user_id: notUser ? undefined : Number(user)
                })
              },
              content: 'Are you sure you want to publish all of this shift?',
            })
          }}
        >
          Publish & Notify
        </Button>
      </Box>
      <Paper elevation={11} sx={{ p: '24px', mb: '1.25rem', borderRadius: '1rem' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography fontWeight={600} fontSize={'16px'} variant="subtitle1">
            Filters
          </Typography>
          <ScheduleFilters setSearchParams={setSearchParams} hf={hf} />
        </Box>
      </Paper>
      <Paper elevation={11} sx={{ borderRadius: '1rem' }} id='printable-content'>
        <Box
          sx={{
            display: 'flex',
            justifyContent: { xs: '', lg: 'space-between' },
            flexDirection: { xs: 'column', lg: 'row' },
            alignItems: 'center',
            px: '1.5rem',
            py: { xs: '1.25rem', lg: '0' },
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Select
              value={searchParams.get(PARAM_KEYS.SCHEDULE_TIMEFRAME)}
              onChange={(e) =>
                setSearchParams(
                  (prev) => {
                    prev.set(PARAM_KEYS.SCHEDULE_TIMEFRAME, e.target.value || '');
                    return prev;
                  },
                  { replace: true }
                )
              }
              sx={{ height: '43px' }}
            >
              <MenuItem value={SCHEDULE_TIMEFRAME.DAY}>Day</MenuItem>
              <MenuItem value={SCHEDULE_TIMEFRAME.WEEK}>Week</MenuItem>
              <MenuItem value={SCHEDULE_TIMEFRAME.TWO_WEEKS}>Two weeks</MenuItem>
            </Select>
            <Button
              variant="outlined"
              sx={{ height: '35px', marginY: 'auto' }}
              onClick={() => {
                setSearchParams(
                  (prev) => {
                    prev.set(PARAM_KEYS.DATE, moment().format())
                    return prev;
                  },
                  { replace: true }
                )
              }}
            >
              Today
            </Button>
            <Button
              startIcon={<IoFilter />}
              sx={{
                border: filtersSelectedDrivers ? `1px solid ${theme.palette.primary.dark}` : '1px solid #dfe4e8',
                color: filtersSelectedDrivers ? theme.palette.primary.dark : '#212b36',
                ':hover': { backgroundColor: 'white' },
                backgroundColor: 'white',
                height: '35px',
                marginY: 'auto',
                px: 2,
              }}
              onClick={() => setFiltersSelectedDrivers(!filtersSelectedDrivers)}
            >
              <Typography variant='body2' sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                Selected Drivers
              </Typography>
            </Button>
          </Box>
          <Box sx={{ paddingY: '1.25rem' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <IoChevronBackOutline
                style={{ marginTop: 'auto', marginBottom: 'auto', cursor: 'pointer' }}
                onClick={() => navigateDays(currentTimeframe * -1)}
              />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h5" fontWeight={700}>
                  {
                    getDateForHeaderSchedule(
                      moment(searchParams.get('date')),
                      searchParams.get(PARAM_KEYS.SCHEDULE_TIMEFRAME) === SCHEDULE_TIMEFRAME.WEEK
                        ? 1
                        : searchParams.get(PARAM_KEYS.SCHEDULE_TIMEFRAME) === SCHEDULE_TIMEFRAME.TWO_WEEKS
                          ? 2
                          : 0
                    )
                  }
                </Typography>
                <Typography fontWeight={700} fontSize={'12px'} color={'#637381'}>
                  WEEK {moment(searchParams.get('date')).utc().isoWeek()}
                </Typography>
              </Box>
              <IoChevronForward
                style={{ marginTop: 'auto', marginBottom: 'auto', cursor: 'pointer' }}
                onClick={() => navigateDays(currentTimeframe)}
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {/* <Button variant="outlined" sx={{ border: '1px solid #dfe4e8', color: '#212b36' }}>
              AUTO-ASSIGN
            </Button> */}
            <Tooltip
              title='Copy schedule'
            >
              <Button
                variant="outlined"
                sx={{ border: '1px solid #dfe4e8', color: '#212b36', width: '10px', px: 0 }}
                onClick={() => setOpenCopyPrevWeek(true)}
              >
                <FaRegCopy fontSize={20}/>
              </Button>
            </Tooltip>
            <Button
              variant="outlined"
              sx={{ border: '1px solid #dfe4e8', color: '#212b36' }}
              onClick={(e) => {
                setAnchorEl(e.currentTarget);
                setOpen(true);
              }}
            >
              <FiMoreVertical fontSize={20} />
            </Button>
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={() => setOpen(false)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
                <PopoverButton text="Print Schedule" onClick={async () => {
                  const content = document.getElementById('printable-content');

                  if (!content) {
                    console.error('No se encontró el contenido para imprimir');
                    return;
                  }
                  const pdf = new jsPDF('l', 'mm', 'letter'); // 'l' para orientación horizontal
                  const canvas = await html2canvas(content);
                  const imgData = canvas.toDataURL('image/png');
                  // Configurar width y height para ocupar todo el ancho y alto del PDF
                  const pdfWidth = pdf.internal.pageSize.getWidth();
                  const pdfHeight = pdf.internal.pageSize.getHeight() / 2;

                  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                  pdf.save('document.pdf');
                  setOpen(false)
                }} />
                <PopoverButton text="Export Schedule" onClick={() => {
                  exportToXLSX({
                    data,
                    columns: [
                      'users',
                      'hours_worked',
                      ...timelineHeaders.map((header) => {
                        return moment(header).format('ddd D')
                      })
                    ],
                    fileName: 'Schedule ' + getDateForHeaderSchedule(
                      moment(searchParams.get('date')),
                      searchParams.get(PARAM_KEYS.SCHEDULE_TIMEFRAME) === SCHEDULE_TIMEFRAME.WEEK
                        ? 1
                        : searchParams.get(PARAM_KEYS.SCHEDULE_TIMEFRAME) === SCHEDULE_TIMEFRAME.TWO_WEEKS
                          ? 2
                          : 0
                    )
                  })
                  setOpen(false)
                }} />
                <PopoverButton text="Clean Schedule" onClick={() => {
                  confirm({
                    action: async () => {
                      const date = searchParams.get(PARAM_KEYS.DATE);
                      const isTwoWeeks = searchParams.get(PARAM_KEYS.SCHEDULE_TIMEFRAME) === 'two weeks';
                      const isDay = searchParams.get(PARAM_KEYS.SCHEDULE_TIMEFRAME) === 'day'
                      const positions = searchParams.get(PARAM_KEYS.FILTERS_POSITION);
                      const notPosition = positions === null || positions === '' || positions === 'All';
                      await cleanScheduleMutation.mutateAsync({
                        from_datetime: isDay
                          ? moment(date).set({ hour: 0, minute: 0, second: 0 }).format('YYYY-MM-DD HH:MM:SS')
                          : getStartOfWeek(moment(date).set({ hour: 0, minute: 0, second: 0 })),
                        to_datetime: isDay
                          ? moment(date).set({ hour: 23, minute: 59, second: 59 }).format('YYYY-MM-DD HH:MM:SS')
                          : getEndOfWeek(
                            moment(date).set({ hour: 23, minute: 59, second: 59 }),
                            isTwoWeeks
                              ? 1
                              : 0
                          ),
                        name_positions: notPosition ? undefined : searchParams.get(PARAM_KEYS.FILTERS_POSITION)!.split(','),
                        jobsite_id: filtersJobsite === null ? jobsites[0].id : Number(filtersJobsite),
                      })
                      setOpen(false)
                    },
                    title: 'Attention',
                    content: 'Are you sure you want to clean this schedule?',
                    actionLabel: 'Clean',
                    cancelLabel: 'Cancel',
                  })
                }} />
              </Box>
            </Popover>
          </Box>
        </Box>
        <TableContainer component={Paper} sx={{ maxHeight: 700 }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }} width={'100px'}>
                  Custom
                </TableCell>
                {timelineHeaders.map((header, index: number) => (
                  <TableCell
                    align="left"
                    sx={{
                      borderBottom: '1px solid #e5e8eb',
                      backgroundColor: moment(header).format('ddd D') == moment().format('ddd D')
                        ? '#e5e8ef'
                        : undefined
                    }}
                    key={index}
                  >
                    {moment(header).format('ddd D')}
                    {
                      isConflicto(index) && (
                        <IoWarning
                          color="#FFAB00"
                          style={{ marginLeft: '10px', paddingTop: '4px' }}
                          fontSize={20}
                        />
                      )
                    }
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {scheduleJobsitesData &&
                data.map((row) => (
                  row !== null &&
                  selectedDriversRowFilter(row) &&
                  <TableRow key={row.id}>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ borderBottom: '1px solid #e5e8eb', padding: '10px' }}
                    >
                      <UserTableCheckbox
                        checked={fields.some((item) => item.driverId === row.id)}
                        idUser={row.id}
                        confirmedWeek={
                          row.shifts.filter(y => y.published && !y.delete_after_published).length > 0 &&
                          row.shifts.filter(y => y.published && !y.delete_after_published).every(x => x.confirmed)
                        }
                        onCopy={() => {
                          setUserIdSelected(row.id)
                          setOpenCopyPrevWeek(true)
                        }}
                        onDelete={() => {
                          confirm({
                            action: async () => {
                              const date = searchParams.get(PARAM_KEYS.DATE);
                              const isTwoWeeks = searchParams.get(PARAM_KEYS.SCHEDULE_TIMEFRAME) === 'two weeks';
                              const isDay = searchParams.get(PARAM_KEYS.SCHEDULE_TIMEFRAME) === 'day'
                              const positions = searchParams.get(PARAM_KEYS.FILTERS_POSITION);
                              const notPosition = positions === null || positions === '' || positions === 'All';
                              await deleteUsersShiftMutation.mutateAsync({
                                from: isDay
                                  ? moment(date).set({ hour: 0, minute: 0, second: 0 }).format('YYYY-MM-DD HH:MM:SS')
                                  : getStartOfWeek(moment(date).set({ hour: 0, minute: 0, second: 0 })),
                                to: isDay
                                  ? moment(date).set({ hour: 23, minute: 59, second: 59 }).format('YYYY-MM-DD HH:MM:SS')
                                  : getEndOfWeek(
                                    moment(date).set({ hour: 23, minute: 59, second: 59 }),
                                    searchParams.get(PARAM_KEYS.SCHEDULE_TIMEFRAME) === 'two weeks'
                                      ? 1
                                      : 0
                                  ),
                                weeks: isTwoWeeks ? 2 : isDay ? 0 : 1,
                                user_id: row.id,
                                names: notPosition ? undefined : searchParams.get(PARAM_KEYS.FILTERS_POSITION)!.split(','),
                              })
                            },
                            title: 'Attention',
                            content: 'Are you sure you want to delete this shifts?',
                            actionLabel: 'Delete',
                            cancelLabel: 'Cancel',
                          })
                        }}
                        onClick={() => {
                          const existingIndex = fields.findIndex((item) => item.driverId === row.id);
                          if (existingIndex !== -1) {
                            remove(existingIndex);
                          } else {
                            append({ driverId: row.id, checked: true });
                          }
                        }}
                        userName={row.firstname + ' ' + row.lastname}
                        time={{ hoursWorked: row.cantidad_horas, totalHours: HOURS_WORKED[searchParams.get(PARAM_KEYS.SCHEDULE_TIMEFRAME) as keyof typeof daysInTimeframe] }}
                      />
                    </TableCell>
                    <>
                      {row.completedShifts.map((shift, index) => (
                        <TableCell
                          align="left"
                          padding="none"
                          sx={{ border: '1px solid #e5e8eb', position: 'relative' }}
                          key={shift?.id ?? Math.random()}
                        >
                          {!shift ? (
                            <>
                              {
                                row.preferences.filter(x => x.date.format('ddd D') == moment(timelineHeaders[index]).format('ddd D')).length > 0 && (
                                  <Box
                                    sx={{
                                      border: `1px solid #919EAB`,
                                      borderRadius: '0.5rem',
                                      m: '6px',
                                      backgroundColor: '#DFE3E8',
                                      display: 'flex',
                                      justifyContent: 'flex-start',
                                      alignItems: 'flex-start',
                                      flexDirection: 'column',
                                      padding: 2,
                                      zIndex: 10
                                    }}
                                  >
                                    <Typography fontSize={'12px'} sx={{ color: 'black', fontWeight: 700 }}>Unavailable</Typography>
                                  </Box>
                                )
                              }
                              <Overlay
                                onClick={() => {
                                  edit({ cellDate: timelineHeaders[index], userData: row });
                                }}
                              />
                            </>
                          ) : shift && shift.delete_after_published ? (
                            <Box>
                              <Box
                                sx={{
                                  border: `1px solid ${rgbToRgbaString(hexToRgb(shift.color), 0.4)}`,
                                  padding: 0.3,
                                  backgroundColor: 'white',
                                  borderRadius: '0.5rem',
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'flex-start',
                                  mx: '6px',
                                }}
                              >
                                <Typography fontSize={'12px'} sx={{ color: '#919EAB', fontWeight: 700 }}>
                                  {`
                                    ${getAmPmFromDateString(shift.from)} - 
                                    ${getAmPmFromDateString(shift.to)}
                                  `}
                                </Typography>
                              </Box>
                              <Overlay
                                onClick={() => {
                                  edit({ cellDate: timelineHeaders[index], userData: row });
                                }}
                              />
                            </Box>
                          ) : (
                            <Box display={'flex'}>
                              <ShiftTableDisplay
                                key={shift.id}
                                colorHEX={shift.color}
                                published={shift.published}
                                deleteAfterPublished={shift.delete_after_published}
                                onClick={() => {
                                  setEditData({
                                    ...shift,
                                    user: {
                                      name: row.firstname + ' ' + row.lastname,
                                      id: row.id
                                    }
                                  })
                                }}
                                time={`
                                  ${getAmPmFromDateString(shift.from)} - 
                                  ${getAmPmFromDateString(shift.to)}
                                `}
                                position={shift.name}
                              />
                              {
                                row.preferences.filter(x => x.date.format('ddd D') == moment(timelineHeaders[index]).format('ddd D')).length > 0 && (
                                  <Box
                                    sx={{
                                      border: `1px solid #919EAB`,
                                      borderRadius: '0.5rem',
                                      m: '6px',
                                      backgroundColor: '#DFE3E8',
                                      display: 'flex',
                                      justifyContent: 'flex-start',
                                      alignItems: 'flex-start',
                                      flexDirection: 'column',
                                      padding: 2,
                                      zIndex: 10
                                    }}
                                  >
                                    <Typography fontSize={'12px'} sx={{ color: 'black', fontWeight: 700 }}>Unavailable</Typography>
                                  </Box>
                                )
                              }
                            </Box>
                          )}
                        </TableCell>
                      ))}
                    </>
                  </TableRow>
                ))}
              <Box sx={{ display: 'flex', paddingTop: isScheduleJobsitesDataLoading ? `${67.6 * usersInJobsite.length}px` : ' 0px' }} />
            </TableBody>
            <TableFooter>
              <TableRow key={1}>
                <TableCell
                  component="th"
                  scope="row"
                  width={'170px'}
                  sx={{ background: '#f4f6f8' }}
                >

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box>
                      <Typography fontSize={'12px'} fontWeight={700}>
                        Assigned Total
                      </Typography>
                      <Typography fontSize={'12px'} color="grey">
                        {obtenerCantidadHoras()}
                        {' / '}
                        {HOURS_WORKED[searchParams.get(PARAM_KEYS.SCHEDULE_TIMEFRAME) as keyof typeof daysInTimeframe] * data.length} hours
                      </Typography>
                    </Box>
                    {/* <IoChevronDownOutline color="#212b36" fontSize={22} /> */}
                  </Box>
                </TableCell>
                <>
                  {Array.from({ length: currentTimeframe }).map((_, index) => (
                    <TableCell
                      key={index}
                      align="center"
                      sx={{
                        border: '1px solid #e5e8eb',
                        fontSize: '1rem',
                        borderTop: 'none',
                        background: '#f4f6f8',
                      }}
                    >
                      {getCantidadHorasByColumn(data.map(x => x?.completedShifts), index)}
                    </TableCell>
                  ))}
                </>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
      <Modal
        open={isEditing}
        onClose={close}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Paper sx={{ padding: 5, width: '800px' }}>
          <ShiftOptions
            time={editingData?.cellDate || ''}
            user={{
              name: editingData?.userData.firstname || '',
              id: editingData?.userData.id || 0,
            }}
            jobsite_id={Number(searchParams.get(PARAM_KEYS.FILTERS_JOBSITE))}
            onClose={close}
          />
        </Paper>
      </Modal>
      <Modal
        open={editData != null}
        onClose={() => setEditData(null)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Paper sx={{ padding: 5, width: '800px' }}>
          <EditOrDeleteShiftOption
            shift={editData!}
            jobsite_id={Number(searchParams.get(PARAM_KEYS.FILTERS_JOBSITE))}
            onClose={() => setEditData(null)}
          />
        </Paper>
      </Modal>
      <Modal
        open={openCopyPrevWeek}
        onClose={() => { setUserIdSelected(undefined); setOpenCopyPrevWeek(false); }}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Paper sx={{ padding: 5, width: '800px' }}>
          <CopyPrevWeekOptions
            weeks={
              searchParams.get(PARAM_KEYS.SCHEDULE_TIMEFRAME) === 'two weeks'
                ? 2
                : searchParams.get(PARAM_KEYS.SCHEDULE_TIMEFRAME) === 'day'
                  ? 0 : 1
            }
            onClose={() => { setUserIdSelected(undefined); setOpenCopyPrevWeek(false); }}
            onSubmit={async (option) => {
              const date = searchParams.get(PARAM_KEYS.DATE);
              const isTwoWeeks = searchParams.get(PARAM_KEYS.SCHEDULE_TIMEFRAME) === 'two weeks';
              const isDay = searchParams.get(PARAM_KEYS.SCHEDULE_TIMEFRAME) === 'day';
              const positions = searchParams.get(PARAM_KEYS.FILTERS_POSITION);
              const notPosition = positions === null || positions === '' || positions === 'All';
              await copyMutation.mutateAsync({
                from: isDay
                  ? moment(date).set({ hour: 0, minute: 0, second: 0 }).subtract(1, 'day').format('YYYY-MM-DD HH:MM:SS')
                  : getStartOfWeek(moment(date).set({ hour: 0, minute: 0, second: 0 }).subtract(isTwoWeeks ? 2 : 1, 'weeks')),
                to: isDay
                  ? moment(date).set({ hour: 23, minute: 59, second: 59 }).subtract(1, 'day').format('YYYY-MM-DD HH:MM:SS')
                  : getEndOfWeek(
                    moment(date).set({ hour: 23, minute: 59, second: 59 }).subtract(isTwoWeeks ? 2 : 1, 'weeks'),
                    searchParams.get(PARAM_KEYS.SCHEDULE_TIMEFRAME) === 'two weeks'
                      ? 1
                      : 0
                  ),
                jobsite_id: filtersJobsite === null ? jobsites[0].id : Number(filtersJobsite),
                overwrite: option === 'OVERWRITE_CONFLICTS',
                weeks: isTwoWeeks ? 2 : isDay ? 0 : 1,
                user_id: userIdSelected,
                names: notPosition ? undefined : searchParams.get(PARAM_KEYS.FILTERS_POSITION)!.split(','),
              })
              setOpenCopyPrevWeek(false);
              setUserIdSelected(undefined)
            }}
          />
        </Paper>
      </Modal>
    </Box>
  );
};
