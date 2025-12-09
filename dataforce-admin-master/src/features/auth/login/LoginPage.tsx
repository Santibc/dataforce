import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config';
import Login from './Login';

// ----------------------------------------------------------------------

function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Login | {APP_NAME}</title>
      </Helmet>

      <Login />
    </>
  );
}

export default LoginPage;
