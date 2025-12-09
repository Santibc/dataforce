import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@mui/material';
import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useAllJobsitesQuery } from 'src/api/jobsitesRepository';
import { useAllPositionsQuery } from 'src/api/positionsRepository';
import { useAllRolesQuery } from 'src/api/rolesRepository';
import {
  HitForm,
  HitFormActions,
  HitFormSubmitButton,
  HitMultiAutocompleteField,
  HitTextField,
} from 'src/components/form';
import * as Yup from 'yup';

export interface UserFormType {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone_number: string;
  driver_amazon_id: string;
  jobsites_id: number[];
  positions_id: number[];
  roles: string[];
}

export interface NewUserProps {
  initialValues?: UserFormType;
  edit?: boolean;
  onSubmit: (values: UserFormType) => Promise<void>;
}

const usersTableFieldsSchema = Yup.object().shape({
  firstname: Yup.string().required('First name is required'),
  lastname: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  phone_number: Yup.string()
    .matches(/^\d{8,15}$/, 'Phone number must be between 8 and 15 digits')
    .required('Phone number is required'),
  driver_amazon_id: Yup.string().required('Amazon ID is required'),
  roles: Yup.array().min(1, 'Role is required'),
  password: Yup.string().nullable(),
  positions_id: Yup.array().of(Yup.string()).min(1, 'Positions is required'),
  jobsites_id: Yup.array().of(Yup.string()).nullable(),
});

function mapToOptions<T extends { id: number | string; name: string }>(positions: T[]) {
  return positions.map((position) => ({
    value: `${position.id}`,
    label: position.name,
  }));
}

export const UserForm: FC<NewUserProps> = ({ initialValues, onSubmit, edit }) => {
  const hf = useForm<UserFormType>({
    values: initialValues,
    mode: 'onBlur',
    resolver: yupResolver(usersTableFieldsSchema),
  });

  const { data: jobsitesData, isFetching: isJobsitesDataFetching } = useAllJobsitesQuery();
  const { data: positionsData, isFetching: isPositionsDataFetching } = useAllPositionsQuery();
  const { data: rolesData, isFetching: isRolesDataFetching } = useAllRolesQuery();

  const parsedJobsitesData = (jobsitesData ?? []).map((x) => ({ value: x.id, label: x.name }));
  const parsedRolesData = (rolesData ?? []).map((x) => ({ value: `${x.name}`, label: x.name }));

  return (
    <Box>
      <HitForm hf={hf} onSubmit={onSubmit}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            paddingLeft: '16px',
            zIndex: 0,
          }}
        >
          <h2>{edit ? 'Edit' : 'New'} User</h2>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(auto-fit, minmax(200px, 1fr))',
                lg: 'repeat(2, 1fr)',
              },
              gap: 2,
            }}
          >
            <Controller
              name="firstname"
              control={hf.control}
              rules={{ required: true }}
              render={(field) => (
                <HitTextField {...field} label="Firt Name" sx={{ marginBottom: '20px' }} />
              )}
            />
            <Controller
              name="lastname"
              control={hf.control}
              rules={{ required: true }}
              render={(field) => (
                <HitTextField {...field} label="Last Name" sx={{ marginBottom: '20px' }} />
              )}
            />
            <Controller
              name="email"
              control={hf.control}
              rules={{ required: true }}
              render={(field) => (
                <HitTextField {...field} label="Email" sx={{ marginBottom: '20px' }} />
              )}
            />
            <Controller
              name="phone_number"
              control={hf.control}
              rules={{ required: true }}
              render={(field) => (
                <HitTextField {...field} label="Mobile Number" sx={{ marginBottom: '20px' }} />
              )}
            />
            <Controller
              name="roles"
              control={hf.control}
              rules={{ required: true }}
              render={(field) => (
                <HitMultiAutocompleteField
                  {...field}
                  label="Select roles"
                  loading={isRolesDataFetching}
                  sx={{ marginBottom: '20px' }}
                  options={parsedRolesData}
                />
              )}
            />
            <Controller
              name="driver_amazon_id"
              control={hf.control}
              rules={{ required: true }}
              render={(field) => (
                <HitTextField {...field} label="Driver Amazon ID" sx={{ marginBottom: '20px' }} />
              )}
            />
            <Controller
              name="jobsites_id"
              control={hf.control}
              rules={{ required: true }}
              render={(field) => (
                <HitMultiAutocompleteField
                  {...field}
                  label="Select jobsites (optional)"
                  loading={isJobsitesDataFetching}
                  sx={{ marginBottom: '20px' }}
                  options={parsedJobsitesData}
                />
              )}
            />
            <Controller
              name="positions_id"
              control={hf.control}
              rules={{ required: true }}
              render={(field) => (
                <HitMultiAutocompleteField
                  {...field}
                  label="Select positions"
                  loading={isPositionsDataFetching}
                  sx={{ marginBottom: '20px' }}
                  options={mapToOptions(positionsData || [])}
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
              <HitFormSubmitButton>Save</HitFormSubmitButton>
            </HitFormActions>
          </Box>
        </Box>
      </HitForm>
    </Box>
  );
};
