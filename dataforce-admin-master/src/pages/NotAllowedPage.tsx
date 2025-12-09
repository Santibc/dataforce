import { Container, Typography } from '@mui/material';
import { m } from 'framer-motion';
import { ForbiddenIllustration } from 'src/assets/illustrations';
import { MotionContainer, varBounce } from 'src/components/animate';

const NotAllowedPage = () => (
  <Container component={MotionContainer} sx={{ textAlign: 'center' }}>
    <m.div variants={varBounce().in}>
      <Typography variant="h3" paragraph>
        Permission Denied
      </Typography>
    </m.div>

    <m.div variants={varBounce().in}>
      <Typography sx={{ color: 'text.secondary' }}>
        You do not have permission to access this page
      </Typography>
    </m.div>

    <m.div variants={varBounce().in}>
      <ForbiddenIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
    </m.div>
  </Container>
);
export default NotAllowedPage;
