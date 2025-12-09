import React, { FC } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Box, IconButton, useTheme } from '@mui/material';

interface OverlayProps {
  onClick: () => void;
}

export const Overlay: FC<OverlayProps> = ({ onClick }) => {
  const theme = useTheme();
  return (
    <Box
      onClick={onClick}
      sx={{
        opacity: 0,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.1)', // Semi-transparent background
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'opacity 0.1s ease-in-out',
        ':hover': {
          opacity: 1,
        },
      }}
    >
      <IconButton>
        <FaPlus size={20} color={theme.palette.primary.light} />
      </IconButton>
    </Box>
  );

}