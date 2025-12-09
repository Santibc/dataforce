import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid } from '@mui/material';
import React, { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import {
    HitForm,
    HitFormActions,
    HitFormSubmitButton,
    HitNumberField,
    HitPhoneField,
    HitTextField,
} from 'src/components/form';
import * as Yup from 'yup';

export interface StepOneFormProps {
    initialValues?: StepOneFormFields;
    onSubmit: (values: StepOneFormFields) => Promise<void>;
    children: React.ReactNode;
}

export interface StepOneFormFields {
    name: string;
    surname: string;
    payroll: string;
    email: string;
    phone_number: string;
}

const defaultValues: StepOneFormFields = {
    name: '',
    surname: '',
    payroll: '',
    email: '',
    phone_number: '',
};

const StepOneFormFieldsSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    surname: Yup.string().required('Surname is required'),
    payroll: Yup.string().required('Payroll is required'),
    email: Yup.string().email('It must be a valid email').required('Email is required'),
    phone_number: Yup.string()
        .matches(/^[\d()]*$/, 'Phone number can only contain numbers and parentheses')
        .required('Phone number is required'),
});

export const StepOneForm: FC<StepOneFormProps> = ({
    initialValues,
    onSubmit,
    children
}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const hf = useForm<StepOneFormFields>({
        defaultValues,
        values: {
            email: searchParams.get('email') || '',
            name: searchParams.get('name') || '',
            payroll: searchParams.get('payroll') || '',
            surname: searchParams.get('surname') || '',
            phone_number: searchParams.get('phone_number') || '',
        },
        mode: 'onBlur',
        resolver: yupResolver(StepOneFormFieldsSchema),
    });

    return (
        <Box>
            <HitForm hf={hf} onSubmit={onSubmit}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        paddingLeft: '16px',
                        maxHeight: '700px',
                        overflowY: 'auto',
                        paddingTop: '30px'
                    }}
                >
                    <Box sx={{ marginX: 'auto' }}>
                        <h4>Please introduce the company owner's information, this data will be used for billing and contact</h4>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Controller
                                name="name"
                                control={hf.control}
                                rules={{ required: true }}
                                render={(field) => (
                                    <HitTextField
                                        {...field}
                                        label="Name *"
                                        placeholder="John"
                                        floatingLabel={false}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="surname"
                                control={hf.control}
                                rules={{ required: true }}
                                render={(field) => (
                                    <HitTextField
                                        {...field}
                                        label="Surname *"
                                        placeholder="Smith"
                                        floatingLabel={false}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="phone_number"
                                control={hf.control}
                                rules={{ required: true, pattern: /^[\d()]*$/ }}
                                render={(field) => (
                                    <HitPhoneField
                                        {...field}
                                        label="Phone number *"
                                        placeholder="(555) 555-1234"
                                        floatingLabel={false}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="email"
                                control={hf.control}
                                rules={{ required: true }}
                                render={(field) => (
                                    <HitTextField
                                        {...field}
                                        label="Email *"
                                        placeholder="johnsmith@gmail.com"
                                        floatingLabel={false}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="payroll"
                                control={hf.control}
                                rules={{ required: true }}
                                render={(field) => (
                                    <HitTextField
                                        {...field}
                                        label="Payroll service *"
                                        placeholder="ADP"
                                        floatingLabel={false}
                                        sx={{ marginBottom: '20px' }}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <HitFormActions>
                            <HitFormSubmitButton>Next</HitFormSubmitButton>
                        </HitFormActions>
                        {children}
                    </Box>
                </Box>
            </HitForm>
        </Box>
    );
};
