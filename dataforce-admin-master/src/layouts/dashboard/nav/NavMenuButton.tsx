import React, { FC } from 'react';
import { Box, SxProps, Typography, useTheme } from '@mui/material';
import { FiChevronDown } from 'react-icons/fi';
import palette from 'src/theme/palette';

interface NavMenuButtonProps {
  icon: React.ReactNode;
  text: string;
  selected?: boolean;
  chevron?: boolean;
  onClick: (e: any) => void;
  sx?: SxProps;
}

export const NavMenuButton: FC<NavMenuButtonProps> = ({
  icon,
  text,
  selected = false,
  chevron = false,
  onClick,
  sx = {}
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingY: 3,
        gap: 1,
        cursor: 'pointer',
        userSelect: 'none',
        ...sx
      }}
      onClick={onClick}
    >
      {icon}
      <Typography
        sx={{ color: selected ? theme.palette.primary.darker : 'inherit', transition: 'color 0.1s ease-in-out' }}
        fontWeight={500}
        variant='body2'
      >
        {text}
      </Typography>
      {chevron && <FiChevronDown />}
    </Box>
  );
}
