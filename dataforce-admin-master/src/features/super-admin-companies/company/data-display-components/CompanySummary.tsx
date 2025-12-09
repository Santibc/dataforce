import { Box, Grid } from '@mui/material';
import React, { FC } from 'react';
import { SeverErrorIllustration, SeoIllustration, OrderCompleteIllustration } from 'src/assets/illustrations';
import { CompanySummaryCard } from './CompanySummaryCard';

interface CompanySummaryProps {
    jobsites: {
        status: string;
        hex: string;
    }
    positions: {
        status: string;
        hex: string;
    }
    users: {
        status: string;
        hex: string;
    }
}

export const CompanySummary: FC<CompanySummaryProps> = ({ positions: quality, jobsites: safetyAndCompliance, users: team }) => (
    <Grid container spacing={3}>
        <Grid item lg={4} xs={12}>
            <CompanySummaryCard imgComponent={<SeverErrorIllustration />} status={safetyAndCompliance.status} statusHexColor={safetyAndCompliance.hex} title="Jobsites" />
        </Grid>
        <Grid item lg={4} xs={12}>
            <CompanySummaryCard imgComponent={<OrderCompleteIllustration />} status={quality.status} statusHexColor={quality.hex} title="Positions" />
        </Grid>
        <Grid item lg={4} xs={12}>
            <CompanySummaryCard imgComponent={<SeoIllustration />} status={team.status} statusHexColor={team.hex} title="Users" />
        </Grid>
    </Grid>
)