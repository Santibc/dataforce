import {useSuperMutation} from '@vadiun/react-hooks';
import {Button, FormikTextInput, Text} from '@vadiun/react-native-eevee';
import {useAuth} from 'app/auth/services/useAuth';
import {Field, Formik} from 'formik';
import React from 'react';
import {View, KeyboardAvoidingView, Platform} from 'react-native';
import styled from 'styled-components/native';
import * as Yup from 'yup';

const Logo = require('assets/vaporeon.jpg');

const Schema = Yup.object().shape({
  email: Yup.string()
    .email('El email es inválido')
    .required('El email es requerido'),
});

export const ForgotPasswordPage = () => {
  const {forgotPassword} = useAuth();

  const forgotPasswordMutations = useSuperMutation(forgotPassword, {
    successMessageType: 'message',
    messages: {
      success: {
        message:
          'Se ha enviado un mail a su casilla de correo con instrucciones para cambiar su contraseña',
      },
    },
  });
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      style={{flex: 1}}>
      <Container contentContainerStyle={{flexGrow: 1, padding: 20}}>
        <View style={{alignItems: 'center'}}>
          <LogoImage source={Logo} resizeMode="contain" />
        </View>
        <Text color="text500">
          Ingrese su email y le enviaremos las instrucciones para modificar su
          contraseña
        </Text>
        <Text>{forgotPasswordMutations.error?.message}</Text>
        <Formik
          initialValues={{email: ''}}
          validationSchema={Schema}
          onSubmit={forgotPasswordMutations.mutate}>
          {({submitForm}) => (
            <View style={{flex: 1}}>
              <Field
                name="email"
                label="Email"
                mode="flat"
                component={FormikTextInput}
                keyboardType="email-address"
                placeholder="Ingrese su email"
              />

              <View style={{marginTop: 'auto'}}>
                <Button
                  onPress={submitForm}
                  mode="contained"
                  style={{padding: 5}}
                  loading={forgotPasswordMutations.isLoading}
                  disabled={forgotPasswordMutations.isLoading}>
                  Continuar
                </Button>
              </View>
            </View>
          )}
        </Formik>
      </Container>
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
