import {StackNavigationProp, createStackNavigator} from '@react-navigation/stack';
import LoginPage from 'app/auth/pages/LoginPage';
import React from 'react';
import {ForgotPasswordPage} from '../pages/ForgotPasswordPage';
import {RegisterPage} from '../pages/RegisterPage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export type AuthNavigationType = {
  login: undefined;
  register: undefined;
  forgotPassword: undefined;
};

const Stack = createStackNavigator<AuthNavigationType>();

export const AuthNavigation = () => {

  const navigate = useNavigation()

  return (
    <Stack.Navigator initialRouteName="login">
      <Stack.Screen
        name="login"
        options={{
          title: 'Login',
          headerShown: false,
        }}
        component={LoginPage}
      />
      <Stack.Screen
        name="forgotPassword"
        options={{
          title: 'Olvidé mi contraseña',
        }}
        component={ForgotPasswordPage}
      />
      <Stack.Screen
        name="register"
        options={{
          title: '',
          headerShadowVisible: false,
          headerLeft: () => (
            <Ionicons
              name="arrow-back"
              size={24}
              color="#242731"
              style={{ marginLeft: 15 }}
              onPress={() => navigate.goBack()}
            />
          ),
        }}
        component={RegisterPage}
      />
    </Stack.Navigator>
  )
}
