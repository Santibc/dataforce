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
  HitTextField,
} from 'src/components/form';
import * as Yup from 'yup';

export interface StepTwoFormProps {
  initialValues?: StepTwoFormFields;
  onSubmit: (values: StepTwoFormFields) => Promise<void>;
  children: React.ReactNode;
}

export interface StepTwoFormFields {
  company_name: string;
  address: string;
  driver_amount: string;
  fleat_size: string;
}

const defaultValues: StepTwoFormFields = {
  company_name: '',
  address: '',
  driver_amount: '',
  fleat_size: '',
};

const StepTwoFormFieldsSchema = Yup.object().shape({
  company_name: Yup.string().required('Company name is required'),
  address: Yup.string().required('Address is required'),
  driver_amount: Yup.string().required('Driver amount is required'),
  fleat_size: Yup.string().required('Fleat size is required'),
});

export const StepTwoForm: FC<StepTwoFormProps> = ({
  initialValues,
  onSubmit,
  children,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const hf = useForm<StepTwoFormFields>({
    defaultValues,
    values: {
      company_name: searchParams.get('company_name') || '',
      address: searchParams.get('address') || '',
      driver_amount: searchParams.get('driver_amount') || '',
      fleat_size: searchParams.get('fleat_size') || '',
    },
    mode: 'onBlur',
    resolver: yupResolver(StepTwoFormFieldsSchema),
  });

  React.useEffect(() => {
    setSearchParams(prev => {
      prev.set('company_name', hf.watch('company_name'));
      prev.set('address', hf.watch('address'));
      prev.set('driver_amount', hf.watch('driver_amount'));
      prev.set('fleat_size', hf.watch('fleat_size'));
      return prev;
    })
  }, [hf.watch('company_name'), hf.watch('address'), hf.watch('driver_amount'), hf.watch('fleat_size')])

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
            <h4>Almost there! Let's proceed by providing some details about your company.</h4>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Controller
                name="company_name"
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
            <Grid item xs={6}>
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
            <Grid item xs={6}>
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
                    sx={{ marginBottom: '20px' }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
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
              {children}
              <HitFormSubmitButton>Next</HitFormSubmitButton>
            </HitFormActions>
          </Box>
        </Box>
      </HitForm>
    </Box>
  );
};
