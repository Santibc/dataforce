import React, { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

interface NavMenuButtonLinkProps {
  icon: React.ReactNode;
  text: string;
  to: string;
}

export const NavMenuButtonLink: FC<NavMenuButtonLinkProps> = ({ icon, text, to }) => (
  <Box sx={{ ':hover': { opacity: '0.7' }, transition: 'opacity 0.2s ease-in-out' }}>
    <Link
      to={to}
      style={{
        display: 'flex',
        color: 'black',
        textDecoration: 'none',
        gap: 10,
      }}
    >
      {icon}
      <Typography variant='body2' fontWeight={500}>{text}</Typography>
    </Link>
  </Box>
);
