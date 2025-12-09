import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
// @mui
import { HitForm } from 'src/components/form/HitForm';
import { HitFormActions, HitFormSubmitButton } from 'src/components/form/HitFormActions';
import { HitTextField } from 'src/components/form/HitTextField';
// routes

// ----------------------------------------------------------------------

export type ResetPasswordFormType = {
  email: string;
};

const ResetPasswordSchema: Yup.SchemaOf<ResetPasswordFormType> = Yup.object().shape({
  email: Yup.string().email('Email must be a valid email address').required('Email is required'),
});

const defaultValues = { email: '' };

type Props = {
  onSubmit: (formValue: ResetPasswordFormType) => Promise<any>;
};

export default function AuthResetPasswordForm({ onSubmit }: Props) {
  const hf = useForm<ResetPasswordFormType>({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues,
  });

  return (
    <HitForm hf={hf} onSubmit={onSubmit}>
      <Controller
        name="email"
        control={hf.control}
        render={(field) => <HitTextField {...field} label="Email address" />}
      />

      <HitFormActions>
        <HitFormSubmitButton> Send Request</HitFormSubmitButton>
      </HitFormActions>
    </HitForm>
  );
}
