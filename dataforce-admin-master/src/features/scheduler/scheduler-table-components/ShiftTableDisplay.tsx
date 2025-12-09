import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { hexToRgb, rgbToRgbaString } from 'src/utils/hexToRgb';

interface ShiftTableDisplayProps {
  colorHEX: string;
  time: string;
  published: boolean;
  deleteAfterPublished: boolean;
  position: string;
  onClick: () => void;
}

export const ShiftTableDisplay: FC<ShiftTableDisplayProps> = ({
  colorHEX = '#ffffff',
  time,
  position,
  published,
  deleteAfterPublished,
  onClick
}) => {

  if(deleteAfterPublished){
    return (
      <Box
        sx={{
          border: `1px solid ${rgbToRgbaString(hexToRgb(colorHEX), 0.4)}`,
          padding: 0.3,
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          mx: '6px'
        }}
      >
        <Typography fontSize={'12px'} sx={{ color: '#919EAB', fontWeight: 700 }}>{time}</Typography>
      </Box>
    )
  }

  return (
    <Box
      onClick={onClick}
      sx={{
        border: `1px solid ${colorHEX}`,
        borderRadius: '0.5rem',
        cursor: 'pointer',
        m: '6px',
        // #aabbff -> [170, 187, 255] -> 'rgba(170, 187, 255, 0.5)'
        backgroundColor: published ? colorHEX : rgbToRgbaString(hexToRgb(colorHEX), 0.2),
        color: published ? 'white' : colorHEX,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'column',
        padding: 1,
        flex:1,
        zIndex: 10
      }}
    >
      <Typography fontSize={'12px'} sx={{ color: 'inherit', fontWeight: 700 }}>{time}</Typography>
      <Typography fontSize={'12px'} sx={{ color: 'inherit' }}>{position}</Typography>
    </Box>
  );
};
