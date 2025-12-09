import { Box, Typography } from '@mui/material';
import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useAllPeekUserPerformancesQuery } from 'src/api/peekUserPerformanceRepository';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { PeekUserPerformanceTable } from './PeekUserPerformanceTable';

interface PeeekUserPerformancePageProps {}

export const PeeekUserPerformancePage: FC<PeeekUserPerformancePageProps> = (props) => {
  const { id } = useParams<{ id: string }>();
  const { data: userData } = useAllPeekUserPerformancesQuery({ user_id: Number(id) });
  return (
    <Box
      sx={{
        paddingX: 3,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h3">{userData?.name || '...'}</Typography>
      </Box>
      <CustomBreadcrumbs
        links={[
          { href: '/dashboard/performance/list', name: 'Performance' },
          { name: 'User Performance' },
        ]}
      />
      <PeekUserPerformanceTable data={userData?.performances || []} />
    </Box>
  );
};
