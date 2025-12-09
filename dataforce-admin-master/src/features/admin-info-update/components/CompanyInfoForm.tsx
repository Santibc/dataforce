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
}

const defaultValues: CompanyInfoFormFields = {
  name: '',
  address: '',
  driver_amount: '',
  fleat_size: '',
  payroll: '',
};

const CompanyInfoFormFieldsSchema = Yup.object().shape({
  name: Yup.string().required('Company name is required'),
  address: Yup.string().required('Address is required'),
  driver_amount: Yup.string().required('Driver amount is required'),
  fleat_size: Yup.string().required('Fleat size is required'),
  payroll: Yup.string().required('Payroll is required'),
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
              <HitFormSubmitButton>Save</HitFormSubmitButton>
            </HitFormActions>
          </Box>
        </Box>
      </HitForm>
    </Box>
  );
};
