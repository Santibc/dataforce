import { Box, Container, Typography } from '@mui/material';
import { m } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { MotionContainer, varBounce } from 'src/components/animate';
import Logo from 'src/components/logo';
import { PATHS } from 'src/routes/paths';

const SuccessPaymentPage = () => (
  <>
    <Helmet>
      <title> Succesfully Payed | Narsus </title>
    </Helmet>
    <Container>
      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h1" paragraph>
            ¡Welcome!
          </Typography>
        </m.div>
        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>Thank you for choosing us!</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Enjoy the benefits of your subscription.
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
          <Box sx={{ marginTop: 2 }}>
            <Logo />
          </Box>
          <Link to={PATHS.config.company.plan} style={{ marginTop: 10, color: 'cornflowerblue' }}>
            Return to App
          </Link>
        </m.div>
      </MotionContainer>
    </Container>
  </>
);

export default SuccessPaymentPage;
