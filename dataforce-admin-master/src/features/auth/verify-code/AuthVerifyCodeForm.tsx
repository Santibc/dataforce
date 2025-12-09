import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
// @mui
import { HitForm } from 'src/components/form/HitForm';
import { HitFormActions, HitFormSubmitButton } from 'src/components/form/HitFormActions';
import { HitNumberField } from 'src/components/form/HitNumberField';
// routes

// ----------------------------------------------------------------------

export type VerifyCodeFormType = {
  code: string;
};

const VerifyCodeSchema: Yup.SchemaOf<VerifyCodeFormType> = Yup.object().shape({
  code: Yup.string().required('Code is required'),
});

const defaultValues: VerifyCodeFormType = {
  code: '',
};

type Props = {
  onSubmit: (formValue: VerifyCodeFormType) => Promise<any>;
};

export default function AuthVerifyCodeForm({ onSubmit }: Props) {
  const hf = useForm({
    mode: 'onBlur',
    resolver: yupResolver(VerifyCodeSchema),
    defaultValues,
  });

  return (
    <HitForm hf={hf} onSubmit={onSubmit}>
      <Controller
        name="code"
        control={hf.control}
        render={(field) => <HitNumberField {...field} label="Code" />}
      />

      <HitFormActions>
        <HitFormSubmitButton>Verify</HitFormSubmitButton>
      </HitFormActions>
    </HitForm>
  );
}
