import { Box, Grid } from '@mui/material';
import { FC } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { SetURLSearchParams } from 'react-router-dom';
import { useAllJobsitesQuery } from 'src/api/jobsitesRepository';
import { useAllPositionsQuery } from 'src/api/positionsRepository';
import { useAllUsersQuery } from 'src/api/usersRepository';
import { HitAutocompleteField, HitForm, HitFreeMultiAutocompleteField } from 'src/components/form';
import { HitSwitchField } from 'src/components/form/HitSwitchField';
import { FiltersFormFields, PARAM_KEYS } from '../SchedulerPage';

interface ScheduleFiltersFormProps {
  hf: ReturnType<typeof useForm<FiltersFormFields>>;
  setSearchParams: SetURLSearchParams;
  /** Renderiza los filtros en una fila compacta para incrustarlos en la toolbar del calendario. */
  compact?: boolean;
}

export function serializeArr(arr: string[]): string {
  return arr.join(',');
}

export function deserializeArr(str: string): string[] {
  return str.split(',');
}

function filterOutAll(arr: any[]) {
  if (arr.length > 1) {
    return arr.filter((option) => option !== 'All');
  }
  return arr;
}

export const ScheduleFilters: FC<ScheduleFiltersFormProps> = ({ hf, setSearchParams, compact }) => {
  const { data: jobsitesData, isFetching: isJobsitesDataFetching } = useAllJobsitesQuery();
  const { data: positionsData, isFetching: isPositionsDataFetching } = useAllPositionsQuery();
  const { data: usersData, isFetching: isUsersDataFetching } = useAllUsersQuery();

  const jobsites_data = (jobsitesData ?? []).map((x) => ({ value: `${x.id}`, label: x.name }));
  const positions_data = (positionsData ?? []).map((x) => ({ value: `${x.id}`, label: x.name }));
  const users_data = (usersData ?? []).map((x) => ({
    value: `${x.id}`,
    label: x.firstname + ' ' + x.lastname,
  }));

  const size = compact ? 'small' : undefined;

  const userField = (
    <Controller
      name="user"
      control={hf.control}
      render={(field) => (
        <HitAutocompleteField
          {...field}
          size={size}
          label="Users"
          options={[...users_data, { value: 'All', label: 'All' }]}
          loading={isUsersDataFetching}
          onChange={(_, value) => {
            setSearchParams(
              (prev) => {
                const user = users_data.filter((x) => x.value === value);
                if (user.length > 0 && user[0].label === 'All') {
                  prev.set(PARAM_KEYS.FILTERS_USER, '0');
                  return prev;
                }
                prev.set(
                  PARAM_KEYS.FILTERS_USER,
                  `${user.length > 0 ? user[0].value.toLowerCase() : ''}`
                );
                return prev;
              },
              { replace: true }
            );
          }}
        />
      )}
    />
  );

  const positionField = (
    <Controller
      name="position"
      control={hf.control}
      render={(field) => (
        <HitFreeMultiAutocompleteField
          {...field}
          size={size}
          loading={isPositionsDataFetching}
          label="Positions"
          options={[...positions_data.map((x) => x.label)]}
          onChange={(_, value) => {
            setSearchParams(
              (prev) => {
                if (value.length === 1 && value[0] === 'All') {
                  prev.set(PARAM_KEYS.FILTERS_POSITION, '');
                  return prev;
                }
                prev.set(PARAM_KEYS.FILTERS_POSITION, `${filterOutAll(value)}`);
                return prev;
              },
              { replace: true }
            );
          }}
        />
      )}
    />
  );

  const jobsiteField = (
    <Controller
      name="jobsite"
      control={hf.control}
      render={(field) => (
        <HitAutocompleteField
          {...field}
          size={size}
          label="Job Sites"
          loading={isJobsitesDataFetching}
          options={jobsites_data}
          onChange={(_, value) => {
            setSearchParams(
              (prev) => {
                prev.set(PARAM_KEYS.FILTERS_JOBSITE, `${value}`);
                return prev;
              },
              { replace: true }
            );
          }}
        />
      )}
    />
  );

  const hideUnscheduledField = (
    <Controller
      name="hideunscheduled"
      control={hf.control}
      render={(field) => (
        <HitSwitchField
          {...field}
          label="Hide Unscheduled"
          field={{
            ...field.field,
            onChange: (_, value) => {
              setSearchParams(
                (prev) => {
                  prev.set(PARAM_KEYS.FILTERS_HIDE_UNSCHEDULED, `${value}`);
                  return prev;
                },
                { replace: true }
              );
            },
          }}
        />
      )}
    />
  );

  if (compact) {
    return (
      <FormProvider {...hf}>
        <Box
          component="form"
          onSubmit={(e) => e.preventDefault()}
          sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}
        >
          <Box sx={{ width: 150 }}>{userField}</Box>
          <Box sx={{ width: 170 }}>{positionField}</Box>
          <Box sx={{ width: 150 }}>{jobsiteField}</Box>
          <Box sx={{ whiteSpace: 'nowrap' }}>{hideUnscheduledField}</Box>
        </Box>
      </FormProvider>
    );
  }

  return (
    <HitForm hf={hf} onSubmit={async () => {}}>
      <Grid container spacing={2} sx={{ pl: 2, pt: 2 }}>
        <Grid item xs={12} lg={3}>
          {userField}
        </Grid>
        <Grid item xs={12} lg={3}>
          {positionField}
        </Grid>
        <Grid item xs={12} lg={3}>
          {jobsiteField}
        </Grid>
        <Grid item xs={12} lg={3}>
          {hideUnscheduledField}
        </Grid>
      </Grid>
    </HitForm>
  );
};
