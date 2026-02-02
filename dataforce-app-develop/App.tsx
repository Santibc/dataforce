import {
  NavigationContainer,
  Theme as NavigationTheme,
} from '@react-navigation/native';
import { AuthNavigation } from './src/app/auth/navigation/AuthNavigation';
import { AuthProvider, useAuth } from 'app/auth/services/useAuth';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MainNavigation } from 'app/main/navigation';
import {
  Provider as EeveeProvider,
  defaultTheme,
  Theme,
  Message,
  Snackbar,
  LoadingSpinner,
  VerifyAction,
} from '@vadiun/react-native-eevee';
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,

} from '@expo-google-fonts/poppins';
import {
  MessageProvider,
  SnackbarProvider,
  SpinnerProvider,
  VerifyActionProvider,
} from '@vadiun/react-hooks';

//@ts-ignore
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { DefaultTheme, Provider as PaperProvider, configureFonts } from 'react-native-paper';
import { useDisplayPushNotificationOnForeground } from 'app/hooks/useDisplayPushNotificationOnForeground';
import { StatusBar } from 'react-native';
import { SplashScreen } from 'app/shared/splash-screen/SplashScreen';

const theme: Theme = {
  typhography: {
    ...defaultTheme.typhography,
    fonts: {
      thin: 'Poppins_300Light', // These names must be the same used in the useFont hooks bellow
      medium: 'Poppins_500Medium',
      bold: 'Poppins_700Bold',
    },
  },
  colors: {
    ...defaultTheme.colors,
    primary500: '#4478C1',
  },
  darkMode: false,
};

const navigationTheme: NavigationTheme = {
  dark: false,
  colors: {
    primary: defaultTheme.colors.primary500,
    background: defaultTheme.colors.white,
    card: defaultTheme.colors.white,
    text: defaultTheme.colors.dark900,
    border: defaultTheme.colors.dark900,
    notification: defaultTheme.colors.dark900,
  },
};

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
})


const fontConfig = {
  default: {
    regular: {
      fontFamily: 'Poppins_500Medium',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Poppins_500Medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Poppins_500Medium',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Poppins_500Medium',
      fontWeight: 'normal',
    },
  },
} as const;

const paperTheme = {
  ...DefaultTheme,
  fonts: configureFonts(fontConfig),
};

const AppBody = () => {
  const auth = useAuth();
  let [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const appReady =
    fontsLoaded &&
    auth.isAuthenticated !== undefined;

  console.log('appReady', appReady);

  useDisplayPushNotificationOnForeground();

  React.useEffect(() => {
    if (appReady) {
    }
  }, [appReady]);

  if (!appReady) {
    return <SplashScreen />;
  }

  if (auth.isAuthenticated) {
    return <MainNavigation />;
  }

  return <AuthNavigation />;
};

const App = () => {
  return (
    <PaperProvider theme={paperTheme}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <EeveeProvider theme={theme}>
            <StyledThemeProvider theme={theme}>
              <MessageProvider component={Message}>
                <SnackbarProvider component={Snackbar}>
                  <SpinnerProvider component={LoadingSpinner}>
                    <VerifyActionProvider component={VerifyAction}>
                      <AuthProvider>
                        <NavigationContainer theme={navigationTheme}>
                          <StatusBar backgroundColor="#181818" barStyle="dark-content" />
                          <AppBody />
                        </NavigationContainer>
                      </AuthProvider>
                    </VerifyActionProvider>
                  </SpinnerProvider>
                </SnackbarProvider>
              </MessageProvider>
            </StyledThemeProvider>
          </EeveeProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </PaperProvider>
  );
};

export default App;
