// i18n
import './locales/i18n';

// scroll bar
import 'simplebar/src/simplebar.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';

// ----------------------------------------------------------------------

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { RouterProvider } from 'react-router-dom';
// components
import { SettingsProvider } from './components/settings';

// Check our docs
// https://docs.minimals.cc/authentication/ts-version

//
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AxiosError } from 'axios';
import moment from 'moment';
import 'moment/dist/locale/es';
import { enqueueSnackbar } from './components/snackbar';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { router } from './routes';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: false } },
  mutationCache: new MutationCache({
    onError: (error, mutation) => {
      const responseData = (error as AxiosError).response?.data as {
        messages?: string[];
        message?: string;
        errors?: Record<string, string[]>;
      };
      let errorMsg = 'Something went wrong';

      if (responseData?.messages) {
        errorMsg = responseData.messages.join('\n');
      } else if (responseData?.errors) {
        // Laravel validation error format
        errorMsg = Object.values(responseData.errors).flat().join('\n');
      } else if (responseData?.message) {
        errorMsg = responseData.message;
      }

      enqueueSnackbar({
        variant: 'error',
        message: errorMsg,
      });
    },
  }),
});

const locale = 'en';
moment.locale(locale);

root.render(
  <QueryClientProvider client={queryClient}>
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={locale}>
      <HelmetProvider>
        <SettingsProvider>
          <RouterProvider router={router} />
        </SettingsProvider>
      </HelmetProvider>
    </LocalizationProvider>
  </QueryClientProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
