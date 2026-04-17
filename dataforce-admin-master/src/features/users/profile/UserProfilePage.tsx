import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import moment from 'moment';
import { FC, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { useAllDailyLogsQuery } from 'src/api/dailyLogRepository';
import { useFindUserQuery } from 'src/api/usersRepository';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useColumns } from 'src/components/datagrid';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { APP_NAME } from 'src/config';
import { DailyLogDashboard } from 'src/features/daily-log/DailyLogDashboard';
import {
  EVENT_TYPE_LABEL_MAP,
  SEVERITY_COLOR_MAP,
  SEVERITY_LABEL_MAP,
  STATUS_COLOR_MAP,
} from 'src/features/daily-log/dailyLogConstants';
import { PATHS } from 'src/routes/paths';
import { LoadingComponent } from 'src/utils/LoadingComponent';

const InfoItem: FC<{ icon: string; label: string; children: React.ReactNode }> = ({
  icon,
  label,
  children,
}) => (
  <Stack direction="row" spacing={1.5} alignItems="flex-start">
    <Iconify icon={icon} width={20} sx={{ color: 'text.secondary', mt: 0.3 }} />
    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Box sx={{ mt: 0.25 }}>{children}</Box>
    </Box>
  </Stack>
);

export const UserProfilePage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const navigate = useNavigate();

  const { data: userData, isFetching: isUserFetching } = useFindUserQuery(userId);
  const { data: allLogs, isFetching: isLogsFetching } = useAllDailyLogsQuery();

  const userLogs = useMemo(
    () => (allLogs || []).filter((log) => log.driver_id === userId),
    [allLogs, userId]
  );

  const historyRows = useMemo(
    () =>
      [...userLogs]
        .sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf())
        .map((log) => ({
          ...log,
          date_formatted: moment(log.date).format('MM/DD/YYYY'),
          event_type_label: EVENT_TYPE_LABEL_MAP[log.event_type] || log.event_type,
          severity_label: SEVERITY_LABEL_MAP[log.severity] || log.severity,
          status_label: log.status === 'submitted' ? 'Submitted' : 'Draft',
        })),
    [userLogs]
  );

  const historyColumns = useColumns<(typeof historyRows)[0]>([
    { field: 'date_formatted', headerName: 'Date', type: 'string', flex: 0.8 },
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
        <Label variant="soft" color={SEVERITY_COLOR_MAP[params.row.severity] || 'default'}>
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
        <Label variant="soft" color={STATUS_COLOR_MAP[params.row.status] || 'default'}>
          {params.value}
        </Label>
      ),
    },
    { field: 'admin_name', headerName: 'Admin', type: 'string', flex: 1 },
    {
      field: 'description',
      headerName: 'Description',
      type: 'string',
      flex: 1.3,
      renderCell: (params) => (
        <Typography variant="body2" noWrap title={params.value || ''}>
          {params.value || '—'}
        </Typography>
      ),
    },
  ]);

  const fullName = userData ? `${userData.firstname} ${userData.lastname}` : '';

  return (
    <>
      <Helmet>
        <title>
          {fullName ? `${fullName} | ` : ''}Users | {APP_NAME}
        </title>
      </Helmet>

      <Box sx={{ paddingX: 3 }}>
        <CustomBreadcrumbs
          links={[
            { href: PATHS.dashboard.users.list, name: 'Users' },
            { name: fullName || 'Profile' },
          ]}
        />

        <LoadingComponent isFetching={isUserFetching}>
          {!userData ? (
            <Paper elevation={3} sx={{ p: 6, borderRadius: 3, textAlign: 'center' }}>
              <Iconify
                icon="eva:person-remove-fill"
                width={64}
                sx={{ color: 'text.disabled', mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                User not found
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => navigate(PATHS.dashboard.users.list)}
              >
                Back to list
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4} lg={3}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 24 }}>
                  <Stack spacing={2.5} alignItems="center">
                    <Avatar
                      sx={{
                        width: 140,
                        height: 140,
                        bgcolor: 'grey.200',
                        color: 'grey.500',
                        border: '4px solid',
                        borderColor: 'background.paper',
                        boxShadow: 2,
                      }}
                    >
                      <Iconify icon="eva:person-fill" width={80} />
                    </Avatar>

                    <Box sx={{ textAlign: 'center', width: '100%' }}>
                      <Typography variant="h5" fontWeight={700}>
                        {fullName}
                      </Typography>
                      {userData.roles?.length > 0 && (
                        <Stack
                          direction="row"
                          spacing={0.5}
                          justifyContent="center"
                          flexWrap="wrap"
                          sx={{ mt: 1, gap: 0.5 }}
                        >
                          {userData.roles.map((role) => (
                            <Label key={role} variant="soft" color="info">
                              {role}
                            </Label>
                          ))}
                        </Stack>
                      )}
                    </Box>

                    <Divider flexItem />

                    <Stack spacing={2} sx={{ width: '100%' }}>
                      <InfoItem icon="eva:email-fill" label="Email">
                        <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                          {userData.email || '—'}
                        </Typography>
                      </InfoItem>

                      <InfoItem icon="eva:phone-fill" label="Phone">
                        <Typography variant="body2">{userData.phone_number || '—'}</Typography>
                      </InfoItem>

                      <InfoItem icon="eva:hash-fill" label="Amazon Driver ID">
                        <Typography variant="body2">{userData.driver_amazon_id || '—'}</Typography>
                      </InfoItem>

                      <InfoItem icon="eva:briefcase-fill" label="Positions">
                        {userData.positions && userData.positions.length > 0 ? (
                          <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
                            {userData.positions.map((p) => (
                              <Label key={p.id} variant="soft" color="primary">
                                {p.name}
                              </Label>
                            ))}
                          </Stack>
                        ) : (
                          <Typography variant="body2" color="text.disabled">
                            —
                          </Typography>
                        )}
                      </InfoItem>

                      <InfoItem icon="eva:pin-fill" label="Jobsites">
                        {userData.jobsites && userData.jobsites.length > 0 ? (
                          <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
                            {userData.jobsites.map((j: any) => (
                              <Label key={j.id} variant="soft" color="success">
                                {j.name || j.nickname || `#${j.id}`}
                              </Label>
                            ))}
                          </Stack>
                        ) : (
                          <Typography variant="body2" color="text.disabled">
                            —
                          </Typography>
                        )}
                      </InfoItem>
                    </Stack>

                    <Divider flexItem />

                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Iconify icon="eva:edit-fill" />}
                      onClick={() => navigate(PATHS.dashboard.users.edit(userId))}
                    >
                      Edit User
                    </Button>
                  </Stack>
                </Paper>
              </Grid>

              <Grid item xs={12} md={8} lg={9}>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h5" fontWeight={700} gutterBottom>
                      Daily Log Metrics
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Performance and incident summary for {fullName}
                    </Typography>
                    <DailyLogDashboard data={userLogs} />
                  </Box>

                  <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 2 }}
                    >
                      <Box>
                        <Typography variant="h6" fontWeight={700}>
                          Complete History
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {userLogs.length} total {userLogs.length === 1 ? 'log' : 'logs'}
                        </Typography>
                      </Box>
                    </Stack>
                    <LoadingComponent isFetching={isLogsFetching}>
                      <Box sx={{ minHeight: 300 }}>
                        <DataGrid
                          autoHeight
                          rows={historyRows}
                          columns={historyColumns}
                          disableRowSelectionOnClick
                          initialState={{
                            pagination: { paginationModel: { pageSize: 10 } },
                          }}
                          pageSizeOptions={[10, 25, 50]}
                        />
                      </Box>
                    </LoadingComponent>
                  </Paper>
                </Stack>
              </Grid>
            </Grid>
          )}
        </LoadingComponent>
      </Box>
    </>
  );
};
