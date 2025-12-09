import * as Yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import {
  HitForm,
  HitFormActions,
  HitFormSubmitButton,
  HitMultiSelectField,
  HitTextField,
} from 'src/components/form';
import { ROLES } from 'src/models/User';

export type EditUserFormType = {
  email: string;
  roles: string[];
};

type Props = {
  values: EditUserFormType;
  onSubmit: (value: EditUserFormType) => Promise<any>;
};

const EditUserSchema: Yup.SchemaOf<EditUserFormType> = Yup.object().shape({
  email: Yup.string().required('Email es requerido').email(),
  roles: Yup.array()
    .min(1, 'Debes elegir al menos un rol')
    .required('Debes elegir al menos un rol'),
});

const defaultValues: EditUserFormType = {
  email: '',
  roles: [],
};

export default function AdminUserEditForm({ values, onSubmit }: Props) {
  const hf = useForm<EditUserFormType>({
    resolver: yupResolver(EditUserSchema),
    defaultValues,
    values,
    mode: 'onBlur',
  });

  return (
    <HitForm hf={hf} onSubmit={onSubmit}>
      <Controller name="email" render={(field) => <HitTextField {...field} label="Email" />} />
      <Controller
        name="roles"
        render={(field) => <HitMultiSelectField {...field} label="Roles" options={ROLES} />}
      />
      <HitFormActions>
        <HitFormSubmitButton>Save</HitFormSubmitButton>
      </HitFormActions>
    </HitForm>
  );
}
