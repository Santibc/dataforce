import { Container, Typography } from '@mui/material';
import { m } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Logo from '../logo/Logo';
import { MotionContainer, varBounce } from 'src/components/animate';
import Image from 'src/components/image';
import { useSettingsContext } from 'src/components/settings';
import { LOGO } from 'src/config';
import { PATHS } from 'src/routes/paths';
import { Link } from 'react-router-dom';

export const SuccessPaymentPage = () => {
  const { themeStretch } = useSettingsContext();
  return (
    <>
      <Helmet>
        <title> Succesfully Payed | Narsus </title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <MotionContainer>
          <m.div variants={varBounce().in}>
            <Typography variant="h3" paragraph color="white">
              ¡Bienvenido a Narsus!
            </Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <Typography sx={{ color: 'text.secondary' }}>
              ¡Gracias por elegirnos! Disfruta los beneficios de tu suscripción
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
            <Link to={PATHS.auth.login} style={{ marginTop: 30, color: 'cornflowerblue' }}>
              Ir a la app
            </Link>
          </m.div>
        </MotionContainer>
      </Container>
    </>
  );
};
