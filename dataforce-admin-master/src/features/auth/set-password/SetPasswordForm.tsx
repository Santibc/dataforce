import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { HitForm } from 'src/components/form/HitForm';
import { HitFormActions, HitFormSubmitButton } from 'src/components/form/HitFormActions';
import { HitTextField } from 'src/components/form/HitTextField';

export type ResetPasswordFormType = {
  password: string;
  confirm_password: string;
};

const ResetPasswordSchema: Yup.SchemaOf<ResetPasswordFormType> = Yup.object().shape({
  password: Yup.string().required('Password is required'),
  confirm_password: Yup.string()
    .required('Password confirmation is required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const defaultValues = { password: '', confirm_password: '' };

type Props = {
  onSubmit: (formValue: ResetPasswordFormType) => Promise<any>;
};

export default function SetPasswordForm({ onSubmit }: Props) {
  const hf = useForm<ResetPasswordFormType>({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues,
  });

  return (
    <HitForm hf={hf} onSubmit={onSubmit}>
      <Controller
        name="password"
        control={hf.control}
        render={(field) => <HitTextField {...field} label="Password" floatingLabel={false} placeholder='•••••••' type='password' />}
      />
      <Controller
        name="confirm_password"
        control={hf.control}
        render={(field) => <HitTextField {...field} label="Confirm password" floatingLabel={false} placeholder='•••••••' type='password' />}
      />
      <HitFormActions>
        <HitFormSubmitButton>Reestablish Password</HitFormSubmitButton>
      </HitFormActions>
    </HitForm>
  );
}
