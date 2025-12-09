import { Box, Button, Paper, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { FaArrowRight } from 'react-icons/fa';
import { APP_NAME } from 'src/config';
import { LoadingComponent } from 'src/utils/LoadingComponent';
import useAdminPlanInfo from './hooks/useAdminPlanInfo';
import { STATUS_LABELS_MAPPERS } from './utils/utils.contants';
const AdminPlanInfoPage = () => {
  const { data, isLoading, handlers } = useAdminPlanInfo();

  return (
    <div>
      <Helmet>
        <title> Company information | {APP_NAME}</title>
      </Helmet>
      <Box
        sx={{
          paddingX: 3,
        }}
      >
        <Typography variant="h3" sx={{ pb: 2 }}>
          Plan Information
        </Typography>
        <Paper
          elevation={2}
          sx={{ padding: '1rem', display: 'flex', justifyContent: 'space-between' }}
        >
          <LoadingComponent isFetching={isLoading}>
            <Box sx={{ display: 'flex', gap: 5 }}>
              <Box>
                <Typography variant="caption" sx={{ pb: 2 }}>
                  PLAN STATUS
                </Typography>
                <Typography variant="h5" sx={{ py: 2 }}>
                  {data?.status ? STATUS_LABELS_MAPPERS[data?.status] : 'No plan'}
                </Typography>
                {data?.ends_at && (
                  <Typography variant="caption">YOUR PLAN ENDS ON: {data.ends_at}</Typography>
                )}
              </Box>
              <Box>
                <Typography variant="caption" sx={{ pb: 2 }}>
                  SEATS
                </Typography>
                <Typography variant="h5" sx={{ py: 2 }}>
                  {data?.seats || 'N/A'}
                </Typography>
              </Box>
            </Box>
          </LoadingComponent>
          <Box>
            <Button variant="outlined" sx={{ width: '200px' }} onClick={handlers.handleViewHistory}>
              customer portal
              <FaArrowRight style={{ marginLeft: '1rem' }} size={18} />
            </Button>
          </Box>
        </Paper>
      </Box>
    </div>
  );
};

export default AdminPlanInfoPage;
