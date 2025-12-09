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
    password: string;
    password_confirmation: string;
};

const ResetPasswordSchema: Yup.SchemaOf<ResetPasswordFormType> = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    password_confirmation: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Password confirmation is required'),
});

const defaultValues = { email: '', password: '', password_confirmation: '' };

type Props = {
    onSubmit: (formValue: ResetPasswordFormType) => Promise<any>;
};

export default function UserAuthResetPasswordForm({ onSubmit }: Props) {
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

            <Controller
                name="password"
                control={hf.control}
                render={(field) => <HitTextField {...field} label="Password" type="password" />}
            />

            <Controller
                name="password_confirmation"
                control={hf.control}
                render={(field) => <HitTextField {...field} label="Confirm Password" type="password" />}
            />

            <HitFormActions>
                <HitFormSubmitButton>Reset password</HitFormSubmitButton>
            </HitFormActions>
        </HitForm>
    );
}