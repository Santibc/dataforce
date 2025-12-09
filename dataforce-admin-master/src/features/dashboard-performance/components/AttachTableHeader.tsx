import { Box, Paper, Typography } from '@mui/material';
import React, { FC } from 'react';

interface AttachTableHeaderProps {
    title: string;
    action: React.ReactNode;
}

export const AttachTableHeader: FC<AttachTableHeaderProps> = ({ action, title }) => (
    <Paper elevation={11}>
        <Box sx={{
            px: 3,
            py: 3,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            marginBottom: -3,
            paddingBottom: 6,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        }}
        >
            <Typography variant="h4">{title}</Typography>
            <Box>
                {action}
            </Box>
        </Box>
    </Paper>
)