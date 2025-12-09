import { FC } from 'react';
import { Box } from '@mui/material';
import { useCreateJobsiteMutation } from 'src/api/jobsitesRepository';
import JobsiteFormController, { NewJobsiteFields } from '../form/JobsiteFormController';

interface CreateJobsitePageProps {}

export const CreateJobsitePage: FC<CreateJobsitePageProps> = (props) => {
  const { mutateAsync: createJobsite, isLoading } = useCreateJobsiteMutation();

  const handleCreateJobSite = async (values: NewJobsiteFields) => {
    await createJobsite(values);
    window.history.back();
  };

  return (
    <Box
      sx={{
        paddingX: 3,
      }}
    >
      <JobsiteFormController onSubmit={handleCreateJobSite} isLoading={isLoading} />
    </Box>
  );
};
