import { Box, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useAllSeederPerformancesQuery } from 'src/api/seederPerformanceRepository';
import { APP_NAME } from 'src/config';
import { PerformanceTable } from './PerformanceTable';

export const PerformancePage: React.FC = () => {
  const { data: performanceData } = useAllSeederPerformancesQuery();

  return (
    <>
      <Helmet>
        <title> Performance | {APP_NAME}</title>
      </Helmet>
      <Box sx={{ paddingX: 3 }}>
        <Typography variant="h3" sx={{ paddingBottom: 4 }}>
          Performance
        </Typography>
        <PerformanceTable data={performanceData || []} />
      </Box>
    </>
  );
};
