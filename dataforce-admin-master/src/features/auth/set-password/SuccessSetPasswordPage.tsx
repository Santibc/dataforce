import { Box, Container, Paper, Typography } from '@mui/material';
import { m } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { MotionContainer, varBounce } from 'src/components/animate';
import Image from 'src/components/image';
import { useSettingsContext } from 'src/components/settings';
import { HEADER, LOGO } from 'src/config';
import useOffSetTop from 'src/hooks/useOffSetTop';
import Header from 'src/layouts/compact/Header';

export const SuccessSetPasswordPage = () => {
  const { themeStretch } = useSettingsContext();
  const isOffset = useOffSetTop(HEADER.H_MAIN_DESKTOP);
  return (
    <>
      <Header isOffset={isOffset} />
      <Helmet>
        <title> Succesfully Set Password | BosMetrics </title>
      </Helmet>
      <Box sx={{ height: '100%' }}>
        <Container
          maxWidth={themeStretch ? false : 'xl'}
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
        >
          <MotionContainer>
            <m.div variants={varBounce().in}>
              <Typography variant="h3" paragraph color="white" sx={{ display: 'flex', justifyContent: 'center', color: 'text.primary' }}>
                Welcome to BosMetrics!
              </Typography>
            </m.div>

            <m.div variants={varBounce().in}>
              <Typography sx={{ color: 'text.secondary', display: 'flex', justifyContent: 'center' }}>
                Your password was successfully set! You can now close this window.
              </Typography>
            </m.div>
            <m.div
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'column',
              }}
              variants={varBounce().in}
            >
              <Image
                src={LOGO}
                style={{
                  height: 260,
                  width: 260,
                  marginTop: 20,
                  borderRadius: 2000,
                  objectFit: 'cover',
                }}
              />
            </m.div>
          </MotionContainer>
        </Container>
      </Box>
    </>
  );
};
