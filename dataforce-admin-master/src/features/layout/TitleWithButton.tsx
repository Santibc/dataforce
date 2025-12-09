import { Box, Typography } from '@mui/material';
import React, { FC } from 'react';

interface TitleWithButtonProps {
  title: string;
  action: React.ReactNode;
}

export const TitleWithButton: FC<TitleWithButtonProps> = ({ title, action }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
    <Typography>{title}</Typography>
    <Box>{action}</Box>
  </Box>
);
