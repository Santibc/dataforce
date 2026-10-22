import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
// @mui
import { Box } from '@mui/material';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import { useSettingsContext } from '../../components/settings';
import LoadingScreen from '../../components/loading-screen';
//
import Header from './header';
import Main from './Main';
import NavHorizontal from './nav/NavHorizontal';
import NavMini from './nav/NavMini';
import NavVertical from './nav/NavVertical';

// ----------------------------------------------------------------------

// TEMPORAL: simula 4 minutos de carga al entrar a cada módulo
const MODULE_LOAD_DELAY_MS = 4 * 60 * 1000;

function DelayedOutlet() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), MODULE_LOAD_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return ready ? <Outlet /> : <LoadingScreen />;
}

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const { themeLayout } = useSettingsContext();

  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');

  const [open, setOpen] = useState(false);

  const isNavHorizontal = themeLayout === 'horizontal';

  const isNavMini = themeLayout === 'mini';

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderNavVertical = <NavVertical openNav={open} onCloseNav={handleClose} />;

  if (isNavHorizontal) {
    return (
      <>
        <Header onOpenNav={handleOpen} />

        {isDesktop ? <NavHorizontal /> : renderNavVertical}

        <Main>
          <DelayedOutlet key={pathname} />
        </Main>
      </>
    );
  }

  if (isNavMini) {
    return (
      <>
        <Header onOpenNav={handleOpen} />

        <Box
          sx={{
            display: { lg: 'flex' },
            minHeight: { lg: 1 },
          }}
        >
          {isDesktop ? <NavMini /> : renderNavVertical}

          <Main>
            <DelayedOutlet key={pathname} />
          </Main>
        </Box>
      </>
    );
  }

  return (
    <>
      <Header onOpenNav={handleOpen} />

      <Box
        sx={{
          display: { lg: 'flex' },
          minHeight: { lg: 1 },
        }}
      >
        {renderNavVertical}

        <Main>
          <DelayedOutlet key={pathname} />
        </Main>
      </Box>
    </>
  );
}
