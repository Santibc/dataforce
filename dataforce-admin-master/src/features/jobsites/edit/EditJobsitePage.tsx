import { FC } from 'react';
import { Box } from '@mui/material';
import { useFindJobsiteQuery, useUpdateJobsiteMutation } from 'src/api/jobsitesRepository';
import { useParams } from 'react-router-dom';
import { LoadingComponent } from 'src/utils/LoadingComponent';
import JobsiteFormController, { NewJobsiteFields } from '../form/JobsiteFormController';

interface EditJobsitePageProps {}

export const EditJobsitePage: FC<EditJobsitePageProps> = (props) => {
  const { mutateAsync: updateJobsite, isLoading } = useUpdateJobsiteMutation();
  const { id } = useParams<{ id: string }>();
  const { data: jobsiteData, isFetching: isJobsitesDataFetching } = useFindJobsiteQuery(Number(id));
  console.log('🚀 ~ file: EditJobsitePage.tsx:14 ~ jobsiteData:', jobsiteData);
  const users = jobsiteData?.users.map((user) => user.id) || [];

  const handleUpdateJobsite = async (values: NewJobsiteFields) => {
    await updateJobsite(values);
    window.history.back();
  };
  return (
    <Box
      sx={{
        paddingX: 3,
      }}
    >
      <LoadingComponent isFetching={isJobsitesDataFetching}>
        {jobsiteData !== undefined && (
          <JobsiteFormController
            initialValues={{ ...jobsiteData, users_id: users }}
            isLoading={isLoading}
            onSubmit={handleUpdateJobsite}
            edit
          />
        )}
      </LoadingComponent>
    </Box>
  );
};
