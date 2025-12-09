// routes
// theme
import ThemeProvider from './theme';
// locales
import ThemeLocalization from './locales';
// components

import moment from 'moment';
import 'moment/dist/locale/es';
import { IntlProvider } from 'react-intl';
import { Outlet } from 'react-router';
import { MotionLazyContainer } from './components/animate';
import { ConfirmActionProvider } from './components/confirm-action/ConfirmAction';
import ScrollToTop from './components/scroll-to-top';
import { ThemeSettings } from './components/settings';
import SnackbarProvider from './components/snackbar/SnackbarProvider';
import { AuthProvider } from './features/auth/JwtContext';
import SpanishLang from './lang/es.json';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
moment.locale('en');
// ----------------------------------------------------------------------

const locale = 'en';
const lang = SpanishLang;

export default function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <AuthProvider>
        <IntlProvider messages={lang} locale={locale} defaultLocale="en">
          <MotionLazyContainer>
            <ThemeProvider>
              <ThemeSettings>
                <ThemeLocalization>
                  <SnackbarProvider>
                    <ConfirmActionProvider
                      defaultProps={{
                        title: 'Attention',
                        content: 'Are you sure you want to delete this item?',
                        actionLabel: 'Delete',
                        cancelLabel: 'Cancel',
                      }}
                    >
                      <ScrollToTop />
                      <Outlet />
                    </ConfirmActionProvider>
                  </SnackbarProvider>
                </ThemeLocalization>
              </ThemeSettings>
            </ThemeProvider>
          </MotionLazyContainer>
        </IntlProvider>
      </AuthProvider>
    </LocalizationProvider>
  );
}
