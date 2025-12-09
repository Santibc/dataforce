import { Box, Button, Container, Typography } from '@mui/material';
import { m } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useCheckoutSignedUrlQuery } from 'src/api/companyPlanInfoRepository';
import { MotionContainer, varBounce } from 'src/components/animate';
import Logo from 'src/components/logo';

const WarningPaymentPage = () => {
  const checkoutLinkQuery = useCheckoutSignedUrlQuery();

  const handleOnClick = async () => {
    window.location.href = checkoutLinkQuery.data ?? '';
  };

  return (
    <>
      <Helmet>
        <title> Succesfully Payed | Narsus </title>
      </Helmet>
      <Container sx={{ minWidth: '400px' }}>
        <MotionContainer>
          <m.div variants={varBounce().in}>
            <Typography variant="h2" paragraph>
              Welcome to Dataforce!
            </Typography>
          </m.div>
          <m.div variants={varBounce().in}>
            <Typography sx={{ color: 'text.secondary' }}>
              Subscribe Now to Access Premium Features and Seamlessly Streamline Your Workforce's
              Schedules
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
            <Button
              onClick={handleOnClick}
              variant="contained"
              sx={{ marginTop: 2 }}
              size="large"
              fullWidth
            >
              Subscribe Now
            </Button>
          </m.div>
        </MotionContainer>
      </Container>
    </>
  );
};

export default WarningPaymentPage;
