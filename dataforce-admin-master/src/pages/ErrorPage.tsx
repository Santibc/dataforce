import { m } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useRouteError } from 'react-router-dom';
// @mui
import { Button, Container, Typography } from '@mui/material';
// components
import { MotionContainer, varBounce } from '../components/animate';
// assets
import { SeverErrorIllustration } from '../assets/illustrations';

// ----------------------------------------------------------------------

export default function ErrorPage() {
  let error = useRouteError();
  return (
    <>
      <Helmet>
        <title> Error | Whalemate</title>
      </Helmet>
      <Container maxWidth="lg">
        <MotionContainer
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <m.div variants={varBounce().in}>
            <Typography variant="h3" paragraph>
              Error
            </Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <Typography>There was an error, please try again later.</Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <Typography sx={{ color: 'text.secondary' }}>
              {(error as any)?.message ?? 'Unknown error'}
            </Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <SeverErrorIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
          </m.div>

          <Button to="/" component={RouterLink} size="large" variant="contained">
            Go to Home
          </Button>
        </MotionContainer>
      </Container>
    </>
  );
}
