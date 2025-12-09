import { Box, Typography, Button } from '@mui/material';
import { FC } from 'react';
import { JobsitesTable } from './JobsitesTable';
import { useNavigate } from 'react-router';
import { useAllJobsitesQuery, useDeleteJobsiteMutation } from 'src/api/jobsitesRepository';
import { PATHS } from 'src/routes/paths';
import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config';

interface JobsitesPageProps {}

export const JobsitesPage: FC<JobsitesPageProps> = (props) => {
  const { data: jobsitesData } = useAllJobsitesQuery();
  const { mutateAsync: deleteJobsite } = useDeleteJobsiteMutation();
  const navigate = useNavigate();

  return (
    <Box>
      <Helmet>
        <title> Jobsites | {APP_NAME}</title>
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
          <Typography variant="h3">Job sites</Typography>
          <Button variant="contained" onClick={() => navigate('/dashboard/jobsites/create')}>
            Create New Job Site
          </Button>
        </Box>
        <JobsitesTable
          data={jobsitesData || []}
          isLoading={false}
          onDelete={(id) => deleteJobsite(id)}
          onEdit={(id) => navigate(PATHS.dashboard.jobsites.edit(id))}
          onSelectUniversidad={() => {}}
        />
      </Box>
    </Box>
  );
};
