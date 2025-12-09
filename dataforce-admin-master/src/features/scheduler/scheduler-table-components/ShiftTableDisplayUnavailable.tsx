import React, { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { hexToRgb, rgbToRgbaString } from 'src/utils/hexToRgb';

interface ShiftTableDisplayUnavailableProps {}

export const ShiftTableDisplayUnavailable: FC<ShiftTableDisplayUnavailableProps> = (props) => (
  <Box
    sx={{
      border: `1px solid #212b36`,
      borderRadius: '0.5rem',
      // #aabbff -> [170, 187, 255] -> 'rgba(170, 187, 255, 0.5)'
      backgroundColor: rgbToRgbaString(hexToRgb('#4f6782'), 0.2),
      color: '#212b36',
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      flexDirection: 'column',
      padding: 1,
      paddingY: 2.5,
      height: '100%',
    }}
  >
    <Typography sx={{ color: 'inherit', fontWeight: 700 }}>UNAVAILABLE</Typography>
  </Box>
);
