import React, { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

interface PopoverButtonProps {
  icon?: React.ReactNode;
  text: string;
  onClick: () => void;
}

export const PopoverButton: FC<PopoverButtonProps> = ({ icon, text, onClick }) => (
  <Box
    sx={{ ':hover': { opacity: '0.7' }, transition: 'opacity 0.2s ease-in-out' }}
    onClick={onClick}
  >
    <Box
      style={{
        display: 'flex',
        color: 'black',
        textDecoration: 'none',
        gap: 10,
        cursor: 'pointer',
      }}
    >
      {icon && icon}
      <Typography fontWeight={500}>{text}</Typography>
    </Box>
  </Box>
);
