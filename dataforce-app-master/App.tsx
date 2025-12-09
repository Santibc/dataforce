import {
  NavigationContainer,
  Theme as NavigationTheme,
} from '@react-navigation/native';
import {AuthNavigation} from './src/app/auth/navigation/AuthNavigation';
import {AuthContext, AuthProvider} from 'app/auth/services/useAuth';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {MainNavigation} from 'app/main/navigation';
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
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import {
  MessageProvider,
  SnackbarProvider,
  SpinnerProvider,
  VerifyActionProvider,
} from '@vadiun/react-hooks';
import {ThemeProvider as StyledThemeProvider} from 'styled-components/native';
import AppLoading from 'expo-app-loading';

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
    primary500: '#00AB55'
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

const App = () => {
  let [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_500Medium,
    Poppins_700Bold,
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaProvider>
      <EeveeProvider theme={theme}>
        <StyledThemeProvider theme={theme}>
          <MessageProvider component={Message}>
            <SnackbarProvider component={Snackbar}>
              <SpinnerProvider component={LoadingSpinner}>
                <VerifyActionProvider component={VerifyAction}>
                  <AuthProvider>
                    <NavigationContainer theme={navigationTheme}>
                      <AuthContext.Consumer>
                        {({isAuthenticated}) =>
                          isAuthenticated === undefined ? (
                            <AppLoading />
                          ) : isAuthenticated === true ? (
                            <MainNavigation />
                          ) : (
                            <AuthNavigation />
                          )
                        }
                      </AuthContext.Consumer>
                    </NavigationContainer>
                  </AuthProvider>
                </VerifyActionProvider>
              </SpinnerProvider>
            </SnackbarProvider>
          </MessageProvider>
        </StyledThemeProvider>
      </EeveeProvider>
    </SafeAreaProvider>
  );
};

export default App;
