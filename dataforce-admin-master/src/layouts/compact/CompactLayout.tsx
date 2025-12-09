import { Outlet } from 'react-router-dom';
// @mui
import { Container, Stack } from '@mui/material';
// hooks
import useOffSetTop from '../../hooks/useOffSetTop';
// config
import { HEADER } from '../../config';
//
import Header from './Header';

// ----------------------------------------------------------------------

export default function CompactLayout() {
  const isOffset = useOffSetTop(HEADER.H_MAIN_DESKTOP);

  return (
    <>
      <Header isOffset={isOffset} />

      <Container component="main" sx={{ backgroundColor: 'background.default' }}>
        <Stack
          sx={{
            py: 12,
            m: 'auto',
            maxWidth: 600,
            minHeight: '100vh',
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          <Outlet />
        </Stack>
      </Container>
    </>
  );
}
