import {Link} from '@react-navigation/native';
import {useMutation} from '@vadiun/react-hooks';
import {
  Button,
  FormikTextInput,
  TextInput,
  Text,
  Checkbox,
} from '@vadiun/react-native-eevee';
import {useAuth} from 'app/auth/services/useAuth';
import {Field, Formik} from 'formik';
import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import * as Yup from 'yup';


const Schema = Yup.object().shape({
  email: Yup.string()
    .email('El email es invalido')
    .required('El email es requerido'),
  password: Yup.string()
    .required('La contraseña es requerida')
    .min(4, 'La contraseña debe tener como minimo 4 caracteres'),
});
const LoginPage = () => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const {login} = useAuth();
  const loginMutation = useMutation(login);

  const [remember, setRemember] = useState(true)

  const initialValues = {
    email: '',
    password: '',
  };

  async function submit(values: {email: string; password: string}) {
    loginMutation.mutate(values);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.welcome}>
          <Text weight="bold" size="9xl">
            Welcome!
          </Text>
          <Text size='md' color="gray400">Sign in to continue</Text>
        </View>
        <Text>{loginMutation.error?.message}</Text>
        <Formik
          initialValues={initialValues}
          validationSchema={Schema}
          onSubmit={submit}>
          {({submitForm}) => (
            <View style={{flex: 2, rowGap: 10}}>
              <Field
                name="email"
                label=""
                placeholder="Name"
                mode="flat"
                component={FormikTextInput}
                keyboardType="email-address"
                left={
                  <TextInput.Icon name="person-outline" />
                }
              />
              <Field
                name="password"
                label=""
                placeholder="Password"
                mode="flat"
                secureTextEntry={secureTextEntry}
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
                component={FormikTextInput}
              />
              <View style={styles.buttons}>
                <View style={styles.row} >
                  <Checkbox 
                    style={styles.checkbox}
                    value={remember}
                    onChange={setRemember}
                  />
                  <Text size='md' >Remember me</Text>
                </View>
                <Button
                  onPress={submitForm}
                  size="md"
                  loading={loginMutation.isLoading}
                  style={{ borderRadius: 8, height: 48 }}
                  disabled={loginMutation.isLoading}>
                  Sign In
                </Button>

                <View style={styles.redirects} >
                  <Link to="/forgotPassword">
                    <Text 
                      color="gray500"
                      size='md'
                      style={{textAlign: 'center'}}
                    >
                      Forgot your password?
                    </Text>
                  </Link>

                  <Text
                    color="gray500"
                    size='md'
                    style={{textAlign: 'center', marginTop: 10}}>
                    Don't have an account?{' '}
                    <Link to="/register">
                      {' '}
                      <Text size='md' weight='bold' color="primary500">Sign Up</Text>
                    </Link>
                  </Text>
                </View>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  buttons: {
    flex: 1,
  },
  checkbox: {
    borderRadius: 5,
  },
  welcome: {
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    flex: 1,
    marginBottom: 20,
    rowGap: 5
  },
  row: {
    flexDirection: 'row',
    marginVertical: 15,
    columnGap: 10
  },
  redirects: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 40
  }
});
