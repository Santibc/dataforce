import { Box, Paper, Typography } from '@mui/material';
import { FC } from 'react';
import { metricColors } from 'src/features/coaching/coaching-table-components/Metrics';
import { Tier } from 'src/models/Performance';

interface DashboardSummaryCardProps {
  title: string;
  imgComponent: string;
  status: Tier | '-';
}

export const DashboardSummaryCard: FC<DashboardSummaryCardProps> = ({
  imgComponent,
  status,
  title,
}) => {
  const color = status === '-' ? 'black' : metricColors[status];
  return (
    <Paper elevation={11} sx={{ padding: 3, borderRadius: '16px', height: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          height: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            justifyContent: 'space-around',
            height: '100%',
          }}
        >
          <Typography variant="h4" fontWeight={800}>
            {title}
          </Typography>
          <Typography variant="h5" color={color}>
            {status}
          </Typography>
        </Box>
        <Box sx={{ height: '80px' }} component="img" src={imgComponent} />
      </Box>
    </Paper>
  );
};
