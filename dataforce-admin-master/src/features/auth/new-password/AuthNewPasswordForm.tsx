import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
// @mui
import { HitForm } from 'src/components/form/HitForm';
import { HitFormActions, HitFormSubmitButton } from 'src/components/form/HitFormActions';
import { HitNumberField } from 'src/components/form/HitNumberField';
import { HitPasswordField } from 'src/components/form/HitPasswordField';
import { HitTextField } from 'src/components/form/HitTextField';
// routes

// ----------------------------------------------------------------------

export type UpdatePasswordFormValueType = {
  code: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const VerifyCodeSchema: Yup.SchemaOf<UpdatePasswordFormValueType> = Yup.object().shape({
  code: Yup.string().required('Code is required'),
  email: Yup.string().email('Email must be a valid email address').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const defaultValues: UpdatePasswordFormValueType = {
  code: '',
  email: '',
  password: '',
  confirmPassword: '',
};

interface Props {
  onSubmit: (value: UpdatePasswordFormValueType) => Promise<any>;
}

export default function AuthNewPasswordForm({ onSubmit }: Props) {
  const hf = useForm({
    mode: 'onBlur',
    resolver: yupResolver(VerifyCodeSchema),
    defaultValues,
  });

  return (
    <HitForm hf={hf} onSubmit={onSubmit}>
      <Controller
        name="email"
        control={hf.control}
        render={(field) => <HitTextField {...field} label="Email" />}
      />

      <Controller
        name="email"
        control={hf.control}
        render={(field) => <HitNumberField {...field} label="Email" />}
      />

      <Controller
        name="code"
        control={hf.control}
        render={(field) => <HitNumberField {...field} label="Code" />}
      />

      <Controller
        name="password"
        control={hf.control}
        render={(field) => <HitPasswordField {...field} label="Password" />}
      />

      <Controller
        name="confirmPassword"
        control={hf.control}
        render={(field) => <HitPasswordField {...field} label="Confirm New Password" />}
      />

      <HitFormActions>
        <HitFormSubmitButton>Update Password</HitFormSubmitButton>
      </HitFormActions>
    </HitForm>
  );
}
