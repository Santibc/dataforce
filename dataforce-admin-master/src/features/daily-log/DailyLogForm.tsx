import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button } from '@mui/material';
import { FC, useEffect, useMemo, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useAllEventTypesQuery } from 'src/api/eventTypeRepository';
import {
  HitForm,
  HitFormActions,
  HitFormSubmitButton,
  HitSelectField,
  HitTextField,
  HitAutocompleteField,
} from 'src/components/form';
import { ModalTitleHeader } from 'src/components/modal-header-with-close-button/ModalTitleHeader';
import * as Yup from 'yup';
import { SEVERITY_OPTIONS } from './dailyLogConstants';

export interface DailyLogFormFields {
  driver_id: number | '';
  event_type: string;
  description: string;
  severity: string;
  action_taken: string;
}

export interface DailyLogFormProps {
  initialValues?: Partial<DailyLogFormFields>;
  edit?: boolean;
  drivers: { value: number; label: string }[];
  onSubmit: (values: DailyLogFormFields, status: 'draft' | 'submitted') => Promise<any>;
  onClose?: () => void;
}

const defaultValues: DailyLogFormFields = {
  driver_id: '',
  event_type: '',
  description: '',
  severity: '',
  action_taken: '',
};

const dailyLogSchema = Yup.object().shape({
  driver_id: Yup.number()
    .required('Driver is required')
    .typeError('Driver is required'),
  event_type: Yup.string().required('Event type is required'),
  severity: Yup.string().required('Severity is required'),
  description: Yup.string().default(''),
  action_taken: Yup.string().default(''),
});

export const DailyLogForm: FC<DailyLogFormProps> = ({
  initialValues,
  edit,
  drivers,
  onSubmit,
  onClose,
}) => {
  const hf = useForm<DailyLogFormFields>({
    defaultValues,
    values: initialValues ? { ...defaultValues, ...initialValues } : undefined,
    mode: 'onBlur',
    resolver: yupResolver(dailyLogSchema) as any,
  });

  const { data: eventTypes } = useAllEventTypesQuery(false);

  const eventTypeOptions = useMemo(() => {
    const fromApi = (eventTypes || []).map((e) => ({ value: e.slug, label: e.name }));
    // When editing a log whose event_type is inactive/deleted, keep the option visible.
    const selected = initialValues?.event_type;
    if (selected && !fromApi.some((o) => o.value === selected)) {
      fromApi.push({ value: selected, label: selected });
    }
    return fromApi;
  }, [eventTypes, initialValues?.event_type]);

  const watchedEventType = hf.watch('event_type');
  const prevEventTypeRef = useRef<string>(initialValues?.event_type || '');

  useEffect(() => {
    // Auto-fill only when the user actively changes the event type (not on initial mount).
    if (watchedEventType === prevEventTypeRef.current) return;

    const preset = (eventTypes || []).find((e) => e.slug === watchedEventType);
    const previousPreset = (eventTypes || []).find((e) => e.slug === prevEventTypeRef.current);

    if (preset) {
      const current = hf.getValues();

      // Only overwrite fields that are empty OR still match the previous preset's default
      // (so we never clobber text the user has actually typed).
      const shouldWrite = (
        currentValue: string | null | undefined,
        previousDefault: string | null | undefined,
      ) => !currentValue || currentValue === (previousDefault || '');

      if (preset.default_severity && shouldWrite(current.severity, previousPreset?.default_severity)) {
        hf.setValue('severity', preset.default_severity, { shouldValidate: true });
      }
      if (preset.default_description != null && shouldWrite(current.description, previousPreset?.default_description)) {
        hf.setValue('description', preset.default_description || '');
      }
      if (preset.default_action_taken != null && shouldWrite(current.action_taken, previousPreset?.default_action_taken)) {
        hf.setValue('action_taken', preset.default_action_taken || '');
      }
    }

    prevEventTypeRef.current = watchedEventType;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedEventType, eventTypes]);

  const handleSaveAsDraft = async () => {
    const isValid = await hf.trigger();
    if (!isValid) return;
    const values = hf.getValues();
    await onSubmit(values, 'draft');
  };

  const handleSubmitLog = async (values: DailyLogFormFields) => {
    await onSubmit(values, 'submitted');
  };

  return (
    <Box>
      <HitForm hf={hf} onSubmit={handleSubmitLog}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            paddingLeft: '16px',
            maxHeight: '700px',
            overflowY: 'auto',
            zIndex: 0,
          }}
        >
          <ModalTitleHeader
            title={`${edit ? 'Edit' : 'New'} Daily Log`}
            onClose={onClose}
          />

          <Box sx={{ mb: 2 }}>
            <Controller
              name="driver_id"
              control={hf.control}
              render={(field) => (
                <HitAutocompleteField
                  {...field}
                  label="Driver *"
                  floatingLabel={false}
                  options={drivers}
                  placeholder="Select a driver"
                />
              )}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Controller
                name="event_type"
                control={hf.control}
                render={(field) => (
                  <HitSelectField
                    {...field}
                    label="Event Type *"
                    floatingLabel={false}
                    placeholder="Select event type"
                    options={eventTypeOptions}
                  />
                )}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Controller
                name="severity"
                control={hf.control}
                render={(field) => (
                  <HitSelectField
                    {...field}
                    label="Severity *"
                    floatingLabel={false}
                    placeholder="Select severity"
                    options={[...SEVERITY_OPTIONS]}
                  />
                )}
              />
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Controller
              name="description"
              control={hf.control}
              render={(field) => (
                <HitTextField
                  {...field}
                  label="Description"
                  floatingLabel={false}
                  multiline
                  rows={3}
                  placeholder="Describe the incident..."
                />
              )}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Controller
              name="action_taken"
              control={hf.control}
              render={(field) => (
                <HitTextField
                  {...field}
                  label="Action Taken"
                  floatingLabel={false}
                  multiline
                  rows={3}
                  placeholder="Describe the action taken..."
                />
              )}
            />
          </Box>

          <HitFormActions>
            <Button
              variant="outlined"
              onClick={handleSaveAsDraft}
              disabled={hf.formState.isSubmitting}
            >
              Save as Draft
            </Button>
            <HitFormSubmitButton>Submit & Send Email</HitFormSubmitButton>
          </HitFormActions>
        </Box>
      </HitForm>
    </Box>
  );
};
