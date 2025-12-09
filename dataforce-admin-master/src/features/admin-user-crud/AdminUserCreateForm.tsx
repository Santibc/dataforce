import * as Yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
// @mui
import { HitTextField } from 'src/components/form';
import { HitCRUDAutocompleteField } from 'src/components/form/HitCRUDAutocompleteField';
import { HitForm } from 'src/components/form/HitForm';
import { HitFormActions, HitFormSubmitButton } from 'src/components/form/HitFormActions';
import { HitPasswordField } from 'src/components/form/HitPasswordField';

export type CreateUserFormType = {
  email: string;
  roles: string[];
  password: string;
  password_confirmation: string;
};

const CreateUserSchema: Yup.SchemaOf<CreateUserFormType> = Yup.object().shape({
  email: Yup.string().required('Email es requerido').email(),
  password: Yup.string()
    .min(4, 'Contraseña debe tener al menos 4 caracteres')
    .required('Contraseña es requerida'),
  password_confirmation: Yup.string()
    .required('Es necesario confirmar la Contraseña')
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden'),
  roles: Yup.array()
    .min(1, 'Debes elegir al menos un rol')
    .required('Debes elegir al menos un rol'),
});

const defaultValues = {
  email: '1',
  roles: [],
  password: '',
  password_confirmation: '',
};

type Props = {
  onSubmit: (value: CreateUserFormType) => Promise<any>;
};

export default function AdminUserCreateForm({ onSubmit }: Props) {
  const hf = useForm<CreateUserFormType>({
    resolver: yupResolver(CreateUserSchema),
    defaultValues,
    mode: 'onBlur',
  });

  return (
    <HitForm hf={hf} onSubmit={onSubmit}>
      <Controller
        name="email"
        control={hf.control}
        render={(field) => <HitTextField {...field} label="Email" placeholder="Carlos" />}
      />
      <Controller
        name="password"
        control={hf.control}
        render={(field) => <HitPasswordField {...field} label="Contraseña" />}
      />
      <Controller
        name="password_confirmation"
        control={hf.control}
        render={(field) => <HitPasswordField {...field} label="Confirmación de Contraseña" />}
      />
      <Controller
        name="roles"
        control={hf.control}
        render={(field) => (
          <HitCRUDAutocompleteField
            {...field}
            label="Roles"
            onCreate={async (value) => alert(value)}
            onDelete={async (value) => alert(value)}
            onEdit={async (value) => alert(value)}
            options={['admin', 'otroAdmin', 'otrotroAdmin']}
          />
        )}
      />

      <HitFormActions>
        <HitFormSubmitButton>Crear</HitFormSubmitButton>
      </HitFormActions>
    </HitForm>
  );
}
