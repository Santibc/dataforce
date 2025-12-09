import { Box, Button, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import { useAllJobsitesQuery } from 'src/api/jobsitesRepository';
import { useAllPositionsQuery } from 'src/api/positionsRepository';
import { useAllUsersQuery } from 'src/api/usersRepository';
import { ComingSoonIllustration } from 'src/assets/illustrations';
import LoadingScreen from 'src/components/loading-screen';
import { APP_NAME } from 'src/config';
import { SchedulerPage } from './SchedulerPage';

export const SchedulerMain = () => {
  const jobsitesQuery = useAllJobsitesQuery();
  const positionsQuery = useAllPositionsQuery();
  const usersQuery = useAllUsersQuery();
  const navigate = useNavigate();

  if (jobsitesQuery.isLoading || positionsQuery.isLoading || usersQuery.isLoading) {
    return <LoadingScreen />;
  }

  if (jobsitesQuery.data && jobsitesQuery.data.length === 0) {
    return (
      <Box
        display={'flex'}
        flexDirection={'column'}
        width={'100%'}
        alignItems={'center'}
        justifyContent={'center'}
        rowGap={'20px'}
        height={'63dvh'}
      >
        <Helmet>
          <title> Schedule | {APP_NAME}</title>
        </Helmet>
        <ComingSoonIllustration />
        <Typography>Create a Jobsite to start scheduling</Typography>
        <Button variant="contained" onClick={() => navigate('/dashboard/jobsites/create')}>
          Create New Job Site
        </Button>
      </Box>
    );
  }

  return (
    <SchedulerPage
      users={usersQuery.data ?? []}
      positions={positionsQuery.data ?? []}
      jobsites={jobsitesQuery.data ?? []}
    />
  );
};
