import { Box, Typography } from '@mui/material';
import React, { FC } from 'react';

interface SubitemProps {
    title: string;
    metric: string;
    hex?: string;
}

export const Subitem: FC<SubitemProps> = ({ metric, title, hex = '#38495c' }) => (
    <Box sx={{ paddingBottom: 2 }}>
        <Typography>{title}</Typography>
        <Typography sx={{ color: hex }}>{metric}</Typography>
    </Box>
)