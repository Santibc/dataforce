import { Box, Paper, Typography } from '@mui/material';
import React, { FC } from 'react';

interface CompanySummaryCardProps {
    title: string;
    imgComponent: React.ReactNode;
    status: string;
    statusHexColor: string;
}

export const CompanySummaryCard: FC<CompanySummaryCardProps> = ({ imgComponent, status, statusHexColor, title }) => (
    <Paper elevation={11} sx={{ padding: 3, borderRadius: '16px', height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'space-around', height: '100%' }}>
                <Typography variant="h4" fontWeight={800}>{title}</Typography>
                <Typography variant="h5" color={statusHexColor}>{status}</Typography>
            </Box>
            <Box sx={{ width: '113px' }}>
                {imgComponent}
            </Box>
        </Box>
    </Paper>
)