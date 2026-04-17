import { Box, Button, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  IDailyLog,
  useAllDailyLogsQuery,
  useCreateDailyLogMutation,
  useDeleteDailyLogMutation,
  useSubmitDailyLogMutation,
  useUpdateDailyLogMutation,
} from 'src/api/dailyLogRepository';
import { useAllUsersQuery } from 'src/api/usersRepository';
import { IslandModal } from 'src/components/island-modal/IslandModal';
import { APP_NAME } from 'src/config';
import useFormHandle from 'src/hooks/useFormHandle';
import Iconify from 'src/components/iconify';
import { DailyLogDashboard } from './DailyLogDashboard';
import { DailyLogForm, DailyLogFormFields } from './DailyLogForm';
import { DailyLogTable } from './DailyLogTable';
import { DailyLogView } from './DailyLogView';

const DailyLogPage = () => {
  const { data: dailyLogsData, isFetching } = useAllDailyLogsQuery();
  const { data: usersData } = useAllUsersQuery();

  const { mutateAsync: createDailyLog } = useCreateDailyLogMutation();
  const { mutateAsync: updateDailyLog } = useUpdateDailyLogMutation();
  const { mutateAsync: submitDailyLog } = useSubmitDailyLogMutation();
  const { mutateAsync: deleteDailyLog } = useDeleteDailyLogMutation();

  const { isEditing, isCreating, editingData, create, edit, close } =
    useFormHandle<IDailyLog>();

  const [viewingData, setViewingData] = useState<IDailyLog | null>(null);
  const closeView = () => setViewingData(null);

  const [view, setView] = useState<'list' | 'dashboard'>('list');

  // Filter users with role "user" (drivers) for the driver select
  const driverOptions =
    usersData
      ?.filter((u) => u.roles.includes('user'))
      .map((u) => ({
        value: u.id,
        label: `${u.firstname} ${u.lastname}`,
      })) || [];

  const handleCreate = async (values: DailyLogFormFields, status: 'draft' | 'submitted') => {
    await createDailyLog({
      driver_id: values.driver_id as number,
      event_type: values.event_type,
      description: values.description || undefined,
      severity: values.severity,
      action_taken: values.action_taken || undefined,
      status,
    });
    close();
  };

  const handleUpdate = async (values: DailyLogFormFields, status: 'draft' | 'submitted') => {
    if (!editingData) return;

    await updateDailyLog({
      id: editingData.id,
      driver_id: values.driver_id as number,
      event_type: values.event_type,
      description: values.description || undefined,
      severity: values.severity,
      action_taken: values.action_taken || undefined,
    });

    if (status === 'submitted') {
      await submitDailyLog(editingData.id);
    }

    close();
  };

  return (
    <>
      <Helmet>
        <title>Daily Log | {APP_NAME}</title>
      </Helmet>

      <Box sx={{ paddingX: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: '2.5rem',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="h3">Daily Log</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <ToggleButtonGroup
              value={view}
              exclusive
              size="small"
              onChange={(_, v) => v && setView(v)}
              sx={{ bgcolor: 'background.paper' }}
            >
              <ToggleButton value="list">
                <Iconify icon="eva:list-fill" sx={{ mr: 1 }} />
                Logs
              </ToggleButton>
              <ToggleButton value="dashboard">
                <Iconify icon="eva:bar-chart-2-fill" sx={{ mr: 1 }} />
                Dashboard
              </ToggleButton>
            </ToggleButtonGroup>
            {view === 'list' && (
              <Button
                variant="contained"
                onClick={create}
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                New Log
              </Button>
            )}
          </Box>
        </Box>

        {view === 'list' ? (
          <Box>
            <DailyLogTable
              data={[...(dailyLogsData || [])]}
              isLoading={isFetching}
              onEdit={(id) => {
                const found = dailyLogsData?.find((d) => d.id === id);
                if (found) edit(found);
              }}
              onDelete={async (id) => {
                await deleteDailyLog(id);
              }}
              onSubmit={async (id) => {
                await submitDailyLog(id);
              }}
              onView={(id) => {
                const found = dailyLogsData?.find((d) => d.id === id);
                if (found) setViewingData(found);
              }}
            />
          </Box>
        ) : (
          <DailyLogDashboard data={dailyLogsData || []} />
        )}
      </Box>

      {isCreating && (
        <IslandModal open={isCreating} onClose={close} maxWidth="700px">
          <DailyLogForm
            drivers={driverOptions}
            onSubmit={handleCreate}
            onClose={close}
          />
        </IslandModal>
      )}

      {isEditing && editingData && (
        <IslandModal open={isEditing} onClose={close} maxWidth="700px">
          <DailyLogForm
            edit
            drivers={driverOptions}
            initialValues={{
              driver_id: editingData.driver_id,
              event_type: editingData.event_type,
              description: editingData.description || '',
              severity: editingData.severity,
              action_taken: editingData.action_taken || '',
            }}
            onSubmit={handleUpdate}
            onClose={close}
          />
        </IslandModal>
      )}

      {viewingData && (
        <IslandModal open onClose={closeView} maxWidth="700px">
          <DailyLogView data={viewingData} onClose={closeView} />
        </IslandModal>
      )}
    </>
  );
};

export default DailyLogPage;
