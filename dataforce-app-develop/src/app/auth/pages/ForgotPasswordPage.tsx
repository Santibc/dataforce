import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Button, FormikTextInput, Message, Text } from '@vadiun/react-native-eevee';
import { useAuth } from 'app/auth/services/useAuth';
import { Field, Formik } from 'formik';
import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import styled from 'styled-components/native';
import * as Yup from 'yup';
import { AuthNavigationType } from '../navigation/AuthNavigation';
import { HitSafeAreaView } from 'components/HitSafeAreaView';

const Logo = require('assets/logo2.png');

const Schema = Yup.object().shape({
  email: Yup.string()
    .email('Email is invalid')
    .required('Email is required'),
});

export const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth();
  const navi = useNavigation<NavigationProp<AuthNavigationType>>();

  // const forgotPasswordMutations = useSuperMutation(forgotPassword, {
  //   successMessageType: 'message',
  //   messages: {
  //     success: {
  //       message:
  //         'Se ha enviado un mail a su casilla de correo con instrucciones para cambiar su contraseña',
  //     },
  //   },
  // });

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      style={{ flex: 1 }}>
        <HitSafeAreaView>
      <Container contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
        <View style={{ alignItems: 'center' }}>
          <LogoImage source={Logo} resizeMode="contain" />
        </View>
        <Message
          isVisible={isSuccess}
          icon={<Message.Icon type="info" />}>
          <Message.Title>Password reset email sent</Message.Title>

          <Message.Subtitle>
            Check your inbox to change your password.
          </Message.Subtitle>
          <Message.Button
            onPress={() => {
              navi.navigate('login');
            }}>
            Continue
          </Message.Button>
        </Message>
        <Text color="text500">
          Enter your email and we'll send you the instructions to change your password
        </Text>
        {isError !== null && <Text>{isError}</Text>}
        <Formik
          initialValues={{ email: '' }}
          validationSchema={Schema}
          onSubmit={async (values) => {
            setIsLoading(true);
            try {
              await forgotPassword(values)
              setIsSuccess(true)
            } catch (error) {
              setIsError('Error ocurred. Try again');
            }
            setIsLoading(false);
          }}>
          {({ submitForm }) => (
            <View style={{ flex: 1 }}>
              <Field
                name="email"
                label="Email"
                mode="flat"
                component={FormikTextInput}
                keyboardType="email-address"
                placeholder="Enter your email"
              />

              <View style={{ marginTop: 'auto', marginBottom: 10 }}>
                <Button
                  onPress={submitForm}
                  style={{ padding: 5 }}
                  loading={isLoading}
                  disabled={isLoading}>
                  Continue
                </Button>
              </View>
            </View>
          )}
        </Formik>
      </Container>
      </HitSafeAreaView>
    </KeyboardAvoidingView>
  );
};

const Container = styled.ScrollView`
  flex: 1;
`;

const LogoImage = styled.Image`
  height: 200px;
  width: 200px;
`;
