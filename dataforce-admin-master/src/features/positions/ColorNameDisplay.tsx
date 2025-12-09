import { Box, Typography } from '@mui/material';
import React, { FC } from 'react';

interface ColorNameDisplayProps {
  name: string;
  color: string;
}

export const ColorNameDisplay: FC<ColorNameDisplayProps> = ({ name = '', color = 'white' }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'flex-start',
    }}
  >
    <Box sx={{ background: color, height: '2.5rem', width: '2.5rem', borderRadius: 1000, mr: 2 }} />
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Typography>{name}</Typography>
    </Box>
  </Box>
);
