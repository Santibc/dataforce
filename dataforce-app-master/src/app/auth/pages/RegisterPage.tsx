import { Link } from '@react-navigation/native';
import {useSuperMutation} from '@vadiun/react-hooks';
import {Button, FormikTextInput, Text, TextInput} from '@vadiun/react-native-eevee';
import {useAuth} from 'app/auth/services/useAuth';
import {Field, Formik} from 'formik';
import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Yup from 'yup';

const Schema = Yup.object().shape({
  email: Yup.string()
    .email('El email es inválido')
    .required('El email es requerido'),
  name: Yup.string().required('El nombre es requerido'),
  password: Yup.string()
    .required('La contraseña es requerida')
    .min(4, 'La contraseña debe tener como mínimo 4 caracteres'),
  passwordRepeat: Yup.string()
    .required('La contraseña es requerida')
    .min(4, 'La contraseña debe tener como mínimo 4 caracteres')
    .test(
      'match',
      'Las contraseñas no coinciden',
      (value, context) => context.parent.password === value,
    ),
});

export const RegisterPage = () => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureTextEntryRepeat, setSecureTextEntryRepeat] = useState(true);
  const {register} = useAuth();
  const registerMutation = useSuperMutation(register, {
    successMessageType: 'message',
    messages: {
      success: {
        title: 'Usuario creado',
        message:
          'Ya casi terminamos. Hemos enviado un email a su casilla de correo para validar su email. Por favor, revise su casilla de spam si el correo no es recibido en los próximos minutos.',
      },
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={20}
      style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 20,
        }}>
          <View style={styles.welcome}>
            <Text weight="bold" size="9xl">
              Sign up
            </Text>
            <Text size='md' color="gray400">Create a new account</Text>
          </View>
        <Formik
          initialValues={{
            email: '',
            password: '',
            passwordRepeat: '',
            name: '',
          }}
          validationSchema={Schema}
          onSubmit={registerMutation.mutate}>
          {({submitForm}) => (
            <View style={{flex: 2, rowGap: 10}}>
              <Field
                name="name"
                label=""
                mode="flat"
                component={FormikTextInput}
                placeholder="Name"
                left={
                  <TextInput.Icon name="person-outline" />
                }
              />
              <Field
                name="email"
                label=""
                mode="flat"
                component={FormikTextInput}
                keyboardType="email-address"
                placeholder="Email"
                left={
                  <TextInput.Icon name="ios-mail-outline" />
                }
              />
              <Field
                name="password"
                label=""
                mode="flat"
                secureTextEntry={secureTextEntry}
                component={FormikTextInput}
                placeholder="Password"
                left={
                  <TextInput.Icon name="lock-closed-outline" />
                }
                right={
                  secureTextEntry ? (
                    <TouchableOpacity onPress={() => setSecureTextEntry(false)}>
                      <TextInput.Icon name="eye-off-outline" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => setSecureTextEntry(true)}>
                      <TextInput.Icon name="eye-outline" />
                    </TouchableOpacity>
                  )
                }
              />
              <Field
                name="passwordRepeat"
                label=""
                mode="flat"
                secureTextEntry={secureTextEntryRepeat}
                component={FormikTextInput}
                placeholder="Repeat password"
                left={
                  <TextInput.Icon name="lock-closed-outline" />
                }
                right={
                  secureTextEntryRepeat ? (
                    <TouchableOpacity
                      onPress={() => setSecureTextEntryRepeat(false)}>
                      <TextInput.Icon name="eye-off-outline" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setSecureTextEntryRepeat(true)}>
                      <TextInput.Icon name="eye-outline" />
                    </TouchableOpacity>
                  )
                }
              />

              <View style={{ flex: 1 }}>
                <Button
                  onPress={submitForm}
                  style={{padding: 5, marginTop: 5, height: 48, borderRadius: 8}}
                  loading={registerMutation.isLoading}
                  disabled={registerMutation.isLoading}>
                  Sign up
                </Button>
                <Text
                  color="gray500"
                  size='md'
                  style={{textAlign: 'center', marginTop: 20}}>
                  By continuing Sign up you agree to the following{' '}
                  <Link to="/register">
                    {' '}
                    <Text size='md' weight='bold' color="primary500">Terms & Conditions</Text>
                  </Link>
                  {' '} without reservation
                </Text>
              </View>
              <Text
                color="gray500"
                size='md'
                style={{textAlign: 'center', marginTop: 10, paddingBottom: 40}}>
                Already have an account?{' '}
                <Link to="/register">
                  {' '}
                  <Text size='md' weight='bold' color="primary500">Sign up</Text>
                </Link>
              </Text>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  welcome: {
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    flex: 1,
    marginBottom: 20,
    rowGap: 5
  },
})