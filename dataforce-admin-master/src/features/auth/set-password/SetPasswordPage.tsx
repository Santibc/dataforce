import { Box, Container, Typography, Paper } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useSettingsContext } from 'src/components/settings';
import SetPasswordForm from './SetPasswordForm';
import { useSetPasswordMutation } from 'src/api/setpasswordRepository';
import { PATHS } from 'src/routes/paths';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import useOffSetTop from 'src/hooks/useOffSetTop';
import { HEADER } from 'src/config';
import Header from 'src/layouts/compact/Header';

// https://www.typescriptlang.org/play?#code/MYewdgzgLgBNBOMC8MDkALKUAOEBcA9AQCYCGUpAZiPMAKYC0pxAtgJZgB0Abs2wK5cwdKAQDEBUvyjoCweHXKNspCBADuNYgToBPAFLZibAJIA2EwCsAQgC0AmgFUAjOoDqAEWvPgALwCKuo4AKgByALIAagBioZEASsEANgDikZEAogCcAAoAyiYQJmC26ABGABKRSVYgbGUADKEAjsEsSZGkGcRmtmH64Q22JrZuUBD+ztZgAPIptgCs4dEmACxuYJFm9gBMJtz2ANZJM3QeoR62GVD8fg1sADIAwvpQ9m7hbDNs+km7-qsZsF4uhQr5oixwikIeFkpZwm5ImxQiwTE0PABzBa2DxJSGWfzYyyOHahSzEQ72YIZAAeoWhyNJh3CAV8oxMviBJhpLOslI+C3ehJMbHUbGI0LAtVMYAaSFQnAg2CSbCgAApUARUABKADcAFgAFBG0CQEBJOicJIgDFqhAAbQQVroYAxMhgDBgzgAunqgA
function getTokenFromURL(url: string) {
  const split = url.split('/');
  return split[split.length - 1];
}

export const SetPasswordPage = () => {
  const { themeStretch } = useSettingsContext();
  const token = getTokenFromURL(window.location.href);
  const { mutateAsync: setPassword } = useSetPasswordMutation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const isOffset = useOffSetTop(HEADER.H_MAIN_DESKTOP);

  return (
    <>
      <Header isOffset={isOffset} />
      <Box sx={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <Helmet>
          <title> Reestablish Password | BosMetrics </title>
        </Helmet>
        <Container maxWidth={themeStretch ? false : 'xl'} sx={{ height: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <Box>
              <Paper elevation={15} sx={{ padding: 5, paddingTop: 3, maxWidth: '500px' }}>
                <Typography variant="h4" sx={{ color: 'text.secondary', display: 'flex', justifyContent: 'center', pb: 3 }}>
                  Reestablish your password!
                </Typography>
                <SetPasswordForm
                  onSubmit={async (form) => {
                    try {
                      await setPassword({ password: form.password, token });
                      navigate(PATHS['successfully-set-password'].root);
                    } catch (error) {
                      enqueueSnackbar(
                        'There was an error while trying to set the password, try again later.',
                        { variant: 'error' } as any
                      );
                    }
                  }}
                />
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};
