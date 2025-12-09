import { forwardRef } from 'react';
// @mui
import { Box, BoxProps } from '@mui/material';
import { LOGO } from 'src/config';
import { useNavigate } from 'react-router';
import { PATHS } from 'src/routes/paths';

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps { }

const Logo = forwardRef<HTMLDivElement, LogoProps>(({ sx, ...other }, ref) => {
  const navigate = useNavigate();
  return (
    <Box
      ref={ref}
      component="div"
      sx={{
        width: 40,
        height: 40,
        display: 'inline-flex',
        cursor: 'pointer',
        ...sx,
      }}
      {...other}
      onClick={() => navigate(PATHS.auth.login)}
    >
      <img src={LOGO} alt="logo" style={{ scale: 1.5, height: 'auto', transform: 'scale(1.7)' }} />
    </Box>
  )
});

export default Logo;
