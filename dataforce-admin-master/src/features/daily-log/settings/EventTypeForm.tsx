import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Stack } from '@mui/material';
import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  HitForm,
  HitFormActions,
  HitFormSubmitButton,
  HitSelectField,
  HitTextField,
} from 'src/components/form';
import { HitSwitchField } from 'src/components/form/HitSwitchField';
import { ModalTitleHeader } from 'src/components/modal-header-with-close-button/ModalTitleHeader';
import * as Yup from 'yup';
import { SEVERITY_OPTIONS } from '../dailyLogConstants';

export interface EventTypeFormFields {
  name: string;
  default_severity: string;
  default_description: string;
  default_action_taken: string;
  is_active: boolean;
}

interface EventTypeFormProps {
  initialValues?: Partial<EventTypeFormFields>;
  edit?: boolean;
  onSubmit: (values: EventTypeFormFields) => Promise<any>;
  onBack: () => void;
}

const defaultValues: EventTypeFormFields = {
  name: '',
  default_severity: '',
  default_description: '',
  default_action_taken: '',
  is_active: true,
};

const eventTypeSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required('Name is required')
    .max(150, 'Max 150 characters'),
  default_severity: Yup.string().default(''),
  default_description: Yup.string().default(''),
  default_action_taken: Yup.string().default(''),
  is_active: Yup.boolean().default(true),
});

export const EventTypeForm: FC<EventTypeFormProps> = ({
  initialValues,
  edit,
  onSubmit,
  onBack,
}) => {
  const hf = useForm<EventTypeFormFields>({
    defaultValues,
    values: initialValues ? { ...defaultValues, ...initialValues } : undefined,
    mode: 'onBlur',
    resolver: yupResolver(eventTypeSchema) as any,
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
            paddingRight: '8px',
            maxHeight: '700px',
            overflowY: 'auto',
            zIndex: 0,
          }}
        >
          <ModalTitleHeader
            title={`${edit ? 'Edit' : 'New'} Event Type`}
            onClose={onBack}
          />

          <Stack spacing={2}>
            <Controller
              name="name"
              control={hf.control}
              render={(field) => (
                <HitTextField
                  {...field}
                  label="Name *"
                  floatingLabel={false}
                  placeholder="e.g. Vehicle Damage"
                />
              )}
            />

            <Controller
              name="default_severity"
              control={hf.control}
              render={(field) => (
                <HitSelectField
                  {...field}
                  label="Default Severity"
                  floatingLabel={false}
                  placeholder="Select default severity"
                  options={[
                    { value: '', label: 'No default' },
                    ...SEVERITY_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
                  ]}
                />
              )}
            />

            <Controller
              name="default_description"
              control={hf.control}
              render={(field) => (
                <HitTextField
                  {...field}
                  label="Default Description"
                  floatingLabel={false}
                  multiline
                  rows={3}
                  placeholder="Default description to auto-fill when selecting this event type..."
                />
              )}
            />

            <Controller
              name="default_action_taken"
              control={hf.control}
              render={(field) => (
                <HitTextField
                  {...field}
                  label="Default Action Taken"
                  floatingLabel={false}
                  multiline
                  rows={3}
                  placeholder="Default action taken to auto-fill..."
                />
              )}
            />

            <Controller
              name="is_active"
              control={hf.control}
              render={(field) => (
                <HitSwitchField
                  {...field}
                  label="Active"
                  floatingLabel={false}
                />
              )}
            />
          </Stack>

          <HitFormActions>
            <Button
              variant="outlined"
              onClick={onBack}
              disabled={hf.formState.isSubmitting}
            >
              Cancel
            </Button>
            <HitFormSubmitButton>{edit ? 'Save Changes' : 'Create'}</HitFormSubmitButton>
          </HitFormActions>
        </Box>
      </HitForm>
    </Box>
  );
};
