import * as Yup from 'yup';

// form
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
// @mui

import { HitForm } from 'src/components/form/HitForm';
import { HitFormActions, HitFormSubmitButton } from 'src/components/form/HitFormActions';
import { HitPasswordField } from 'src/components/form/HitPasswordField';

export interface ChangePasswordFormType {
  password: string;
  password_confirmation: string;
}

const EditUserSchema: Yup.SchemaOf<ChangePasswordFormType> = Yup.object().shape({
  password: Yup.string()
    .min(4, 'Contraseña debe tener al menos 4 caracteres')
    .required('Contraseña es requerida'),
  password_confirmation: Yup.string()
    .required('Es necesario confirmar la Contraseña')
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden'),
});

const defaultValues = { password: '', password_confirmation: '' };

type Props = {
  onSubmit: (value: ChangePasswordFormType) => Promise<any>;
};

export default function AdminUserChangePasswordForm({ onSubmit }: Props) {
  const hf = useForm<ChangePasswordFormType>({
    resolver: yupResolver(EditUserSchema),
    defaultValues,
    mode: 'onBlur',
  });

  return (
    <HitForm hf={hf} onSubmit={onSubmit}>
      <Controller
        name="password"
        control={hf.control}
        render={(field) => <HitPasswordField {...field} label="Contraseña" />}
      />
      <Controller
        name="password_confirmation"
        control={hf.control}
        render={(field) => <HitPasswordField {...field} label="Confirmar Contraseña" />}
      />

      <HitFormActions>
        <HitFormSubmitButton>Save</HitFormSubmitButton>
      </HitFormActions>
    </HitForm>
  );
}
