import { Grid } from '@mui/material';
import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
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

export const ScheduleFilters: FC<ScheduleFiltersFormProps> = ({ hf, setSearchParams }) => {
  const { data: jobsitesData, isFetching: isJobsitesDataFetching } = useAllJobsitesQuery();
  const { data: positionsData, isFetching: isPositionsDataFetching } = useAllPositionsQuery();
  const { data: usersData, isFetching: isUsersDataFetching } = useAllUsersQuery();

  const jobsites_data = (jobsitesData ?? []).map((x) => ({ value: `${x.id}`, label: x.name }));
  const positions_data = (positionsData ?? []).map((x) => ({ value: `${x.id}`, label: x.name }));
  const users_data = (usersData ?? []).map((x) => ({
    value: `${x.id}`,
    label: x.firstname + ' ' + x.lastname,
  }));

  return (
    <HitForm hf={hf} onSubmit={async (values) => {}}>
      <Grid container spacing={2} sx={{ pl: 2, pt: 2 }}>
        <Grid item xs={12} lg={3}>
          <Controller
            name="user"
            control={hf.control}
            render={(field) => (
              <HitAutocompleteField
                {...field}
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
        </Grid>
        <Grid item xs={12} lg={3}>
          <Controller
            name="position"
            control={hf.control}
            render={(field) => (
              <HitFreeMultiAutocompleteField
                {...field}
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
                      console.log('inside value', value);

                      prev.set(PARAM_KEYS.FILTERS_POSITION, `${filterOutAll(value)}`);
                      return prev;
                    },
                    { replace: true }
                  );
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} lg={3}>
          <Controller
            name="jobsite"
            control={hf.control}
            render={(field) => (
              <HitAutocompleteField
                {...field}
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
        </Grid>

        <Grid item xs={12} lg={3}>
          <Controller
            name="hideunscheduled"
            control={hf.control}
            render={(field) => (
              <HitSwitchField
                {...field}
                label="Hide Unscheduled Users"
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
        </Grid>
      </Grid>
    </HitForm>
  );
};
