import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid, Typography } from '@mui/material';
import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  HitForm,
  HitFormActions,
  HitFormSubmitButton,
  HitNumberField,
  HitTextField,
} from 'src/components/form';
import * as Yup from 'yup';

export interface CompanyInfoFormProps {
  initialValues?: CompanyInfoFormFields;
  onSubmit: (values: CompanyInfoFormFields) => Promise<void>;
  title?: string;
}

export interface CompanyInfoFormFields {
  name: string;
  address: string;
  driver_amount: string;
  fleat_size: string;
  payroll: string;
  overtime_threshold: string;
  daily_hours_limit: string;
  daily_hours_warning: string;
}

const defaultValues: CompanyInfoFormFields = {
  name: '',
  address: '',
  driver_amount: '',
  fleat_size: '',
  payroll: '',
  overtime_threshold: '40',
  daily_hours_limit: '12',
  daily_hours_warning: '10',
};

const CompanyInfoFormFieldsSchema = Yup.object().shape({
  name: Yup.string().required('Company name is required'),
  address: Yup.string().required('Address is required'),
  driver_amount: Yup.string().required('Driver amount is required'),
  fleat_size: Yup.string().required('Fleat size is required'),
  payroll: Yup.string().required('Payroll is required'),
  overtime_threshold: Yup.string()
    .required('Overtime threshold is required')
    .matches(/^\d+$/, 'Must be a whole number of hours'),
  daily_hours_limit: Yup.string()
    .required('Daily hours limit is required')
    .matches(/^\d+$/, 'Must be a whole number of hours'),
  daily_hours_warning: Yup.string()
    .required('Daily hours warning is required')
    .matches(/^\d+$/, 'Must be a whole number of hours')
    .test(
      'below-daily-limit',
      'The warning must be lower than the daily limit',
      (value, ctx) =>
        !value || !ctx.parent.daily_hours_limit || Number(value) < Number(ctx.parent.daily_hours_limit)
    ),
});

export const CompanyInfoForm: FC<CompanyInfoFormProps> = ({ initialValues, onSubmit, title }) => {
  const hf = useForm<CompanyInfoFormFields>({
    defaultValues,
    values: initialValues,
    mode: 'onBlur',
    resolver: yupResolver(CompanyInfoFormFieldsSchema),
  });

  return (
    <Box>
      <Typography variant="h3" sx={{ pb: 2 }}>
        {title || 'Company Information'}
      </Typography>
      <HitForm hf={hf} onSubmit={onSubmit}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            paddingLeft: '16px',
            maxHeight: '700px',
            overflowY: 'auto',
            paddingTop: '30px',
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="name"
                control={hf.control}
                rules={{ required: true }}
                render={(field) => (
                  <HitTextField
                    {...field}
                    label="Company name *"
                    placeholder="Google"
                    floatingLabel={false}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="address"
                control={hf.control}
                rules={{ required: true }}
                render={(field) => (
                  <HitTextField
                    {...field}
                    label="Address *"
                    placeholder="1600 Amphitheatre Parkway, California"
                    floatingLabel={false}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="driver_amount"
                control={hf.control}
                rules={{ required: true }}
                render={(field) => (
                  <HitNumberField
                    {...field}
                    label="Driver amount *"
                    placeholder="100"
                    floatingLabel={false}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="fleat_size"
                control={hf.control}
                rules={{ required: true }}
                render={(field) => (
                  <HitNumberField
                    {...field}
                    label="Fleat size *"
                    placeholder="200"
                    floatingLabel={false}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="overtime_threshold"
                control={hf.control}
                rules={{ required: true }}
                render={(field) => (
                  <HitNumberField
                    {...field}
                    label="Weekly overtime limit (hours) *"
                    placeholder="40"
                    floatingLabel={false}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="daily_hours_limit"
                control={hf.control}
                rules={{ required: true }}
                render={(field) => (
                  <HitNumberField
                    {...field}
                    label="Daily hours limit (hours) *"
                    placeholder="12"
                    floatingLabel={false}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="daily_hours_warning"
                control={hf.control}
                rules={{ required: true }}
                render={(field) => (
                  <HitNumberField
                    {...field}
                    label="Daily hours warning (hours) *"
                    placeholder="10"
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
              <HitFormSubmitButton>Save</HitFormSubmitButton>
            </HitFormActions>
          </Box>
        </Box>
      </HitForm>
    </Box>
  );
};
