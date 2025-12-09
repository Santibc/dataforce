import * as Yup from 'yup';
import { Box } from '@mui/material';
import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  HitForm,
  HitFormActions,
  HitFormSubmitButton,
  HitNumberField,
  HitTextField,
} from 'src/components/form';
import { IRecievedJobsite } from 'src/api/jobsitesRepository';
import { yupResolver } from '@hookform/resolvers/yup';

interface NewJobsiteProps {
  edit?: boolean;
  onSubmit: (values: IRecievedJobsite) => Promise<void>;
  initialValues?: IRecievedJobsite;
}

export const defaultValues: IRecievedJobsite = {
  id: 0,
  name: '',
  address_street: '',
  state: '',
  city: '',
  zip_code: '',
  users: [],
};

const newJobsiteFieldsSchema = Yup.object().shape({
  id: Yup.number(),
  name: Yup.string().required('Name is required'),
  address_street: Yup.string().required('Address is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  zip_code: Yup.string().required('ZIP code is required'),
});
export const NewJobsiteForm: FC<NewJobsiteProps> = ({ edit, onSubmit, initialValues }) => {
  const hf = useForm<IRecievedJobsite>({
    defaultValues,
    values: initialValues,
    mode: 'onBlur',
    resolver: yupResolver(newJobsiteFieldsSchema),
  });
  console.log('🚀 ~ file: NewJobsiteForm.tsx:51 ~ hf:', hf.formState?.errors);

  return (
    <HitForm hf={hf} onSubmit={onSubmit}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          paddingLeft: '16px',
          overflowY: 'auto',
          zIndex: 0,
        }}
      >
        <h2>{edit ? 'Edit' : 'New'} Jobsite</h2>
        <h3>Information</h3>
        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', lg: 'row' } }}>
          <Box sx={{ width: { xs: '100%', lg: '50%' } }}>
            <Controller
              name="name"
              control={hf.control}
              rules={{ required: true }}
              render={(field) => (
                <HitTextField
                  {...field}
                  label="Name *"
                  floatingLabel={false}
                  sx={{ marginBottom: { xs: '-10px', lg: '20px' } }}
                />
              )}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              width: { xs: '100%', lg: '50%' },
              gap: 2,
              flexDirection: { xs: 'column', lg: 'row' },
            }}
          >
            <Box sx={{ width: { xs: '100%', lg: '100%' } }}>
              <Controller
                name="address_street"
                control={hf.control}
                rules={{ required: true }}
                render={(field) => (
                  <HitTextField
                    {...field}
                    label="Address *"
                    floatingLabel={false}
                    sx={{ marginBottom: { xs: '20px', lg: '20px' } }}
                  />
                )}
              />
            </Box>
          </Box>
        </Box>{' '}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(auto-fit, minmax(200px, 1fr))',
              lg: 'repeat(3, 1fr)',
            },
            gap: 4,
          }}
        >
          <Controller
            name="city"
            control={hf.control}
            rules={{ required: true }}
            render={(field) => (
              <HitTextField
                {...field}
                label="City *"
                floatingLabel={false}
                sx={{ marginBottom: { xs: '-10px', lg: '20px' } }}
              />
            )}
          />
          <Controller
            name="state"
            control={hf.control}
            rules={{ required: true }}
            render={(field) => (
              <HitTextField
                {...field}
                label="State *"
                floatingLabel={false}
                sx={{ marginBottom: { xs: '-10px', lg: '20px' } }}
              />
            )}
          />
          <Controller
            name="zip_code"
            control={hf.control}
            rules={{ required: true }}
            render={(field) => (
              <HitTextField
                {...field}
                label="Zip *"
                floatingLabel={false}
                sx={{ marginBottom: { xs: '0', lg: '20px' } }}
              />
            )}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            paddingTop: '20px',
          }}
        >
          <HitFormActions>
            <HitFormSubmitButton>Next</HitFormSubmitButton>
          </HitFormActions>
        </Box>
      </Box>
    </HitForm>
  );
};
