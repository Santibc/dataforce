import { Grid } from '@mui/material';
import { FC } from 'react';
import Img1 from 'src/assets/vector-1.png';
import Img2 from 'src/assets/vector-2.png';
import Img3 from 'src/assets/vector-3.png';
import Img4 from 'src/assets/vector-4.png';

import { Tier } from 'src/models/Performance';
import { DashboardSummaryCard } from './DashboardSummaryCard';

interface DashboardSummaryProps {
  safetyAndCompliance: {
    status: Tier | '-';
  };
  quality: {
    status: Tier | '-';
  };
  team: {
    status: Tier | '-';
  };
  overallStanding: {
    status: Tier | '-';
  };
}

export const DashboardSummary: FC<DashboardSummaryProps> = ({
  quality,
  safetyAndCompliance,
  team,
  overallStanding,
}) => (
  <Grid container spacing={2}>
    <Grid item lg={3} xs={12}>
      <DashboardSummaryCard imgComponent={Img3} status={overallStanding.status} title="Overall Standing" />
    </Grid>
    <Grid item lg={3} xs={12}>
      <DashboardSummaryCard
        imgComponent={Img1}
        status={safetyAndCompliance.status}
        title="Safety and Compliance"
      />
    </Grid>
    <Grid item lg={3} xs={12}>
      <DashboardSummaryCard imgComponent={Img4} status={quality.status} title="Quality" />
    </Grid>
    <Grid item lg={3} xs={12}>
      <DashboardSummaryCard imgComponent={Img2} status={team.status} title="Team" />
    </Grid>
  </Grid>
);
