import { yupResolver } from '@hookform/resolvers/yup';
import { Box, InputLabel, Popover } from '@mui/material';
import moment, { Moment } from 'moment';
import React, { FC } from 'react';
import { TwitterPicker } from 'react-color';
import { Controller, useForm } from 'react-hook-form';
import { HitForm, HitFormActions, HitFormSubmitButton, HitTextField } from 'src/components/form';
import { HitTimeField } from 'src/components/form/HitTimeField';
import { ModalTitleHeader } from 'src/components/modal-header-with-close-button/ModalTitleHeader';
import * as Yup from 'yup';

export interface NewPositionProps {
  initialValues?: NewPositionFields;
  edit?: boolean;
  isShift?: boolean;
  onSubmit: (values: NewPositionFields) => Promise<any>;
  onClose?: () => void;
}

export interface NewPositionFields {
  id: number;
  name: string;
  from: Moment | null;
  to: Moment | null;
  color: string;
}

const defaultValues: NewPositionFields = {
  id: 0,
  name: '',
  from: null,
  to: null,
  color: '#7BDCB5',
};

const newPositionFieldsSchema = Yup.object().shape({
  id: Yup.number(),
  name: Yup.string().required('Name is required'),
  from: Yup.string().nullable().required('Time is required'),
  to: Yup.string()
    .nullable()
    .test('validateToTime', 'End time must be after Start time', (value, context) => {
      const { from } = context.parent;

      if (value === undefined) return false;

      const fromMoment = moment(from);
      const toMoment = moment(value);

      return fromMoment.isBefore(toMoment);
    })
    .required('Time is required'),
  color: Yup.string().required('Color is required'),
});

export const NewPositionForm: FC<NewPositionProps> = ({
  initialValues,
  onSubmit,
  edit,
  isShift,
  onClose,
}) => {
  const hf = useForm<NewPositionFields>({
    defaultValues,
    values: initialValues,
    mode: 'onBlur',
    resolver: yupResolver(newPositionFieldsSchema),
  });
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const { color } = hf.watch();

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
            zIndex: 0,
          }}
        >
          <ModalTitleHeader
            title={`${edit ? 'Edit' : 'New'} ${isShift ? 'Shift' : 'Position'}`}
            onClose={onClose}
          />
          <Box sx={{ display: 'flex' }}>
            <Controller
              name="name"
              control={hf.control}
              rules={{ required: true }}
              render={(field) => (
                <Box sx={{ display: 'flex', width: '100%' }}>
                  <HitTextField
                    {...field}
                    label="Title *"
                    floatingLabel={false}
                    sx={{ marginBottom: '20px' }}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', ml: '0.5rem' }}>
                    <InputLabel htmlFor={'afssa'} error={!!hf.formState.errors.color}>
                      Color
                    </InputLabel>
                    <Box
                      onClick={(e) => {
                        setOpen(true);
                        setAnchorEl(e.currentTarget);
                      }}
                      sx={{
                        width: '7rem',
                        height: '7rem',
                        borderRadius: '100%',
                        background: color,
                        cursor: 'pointer',
                        scale: '0.7',
                        mt: '-1rem',
                      }}
                    />
                  </Box>
                </Box>
              )}
            />
          </Box>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={() => setOpen(false)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <TwitterPicker color={color} onChange={(c) => hf.setValue('color', c.hex)} />
          </Popover>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Controller
              name="from"
              control={hf.control}
              rules={{ required: true }}
              render={(field) => (
                <Box sx={{ width: '45%' }}>
                  <HitTimeField label="Start time *" floatingLabel={false} ampm {...field} />
                </Box>
              )}
            />
            <Controller
              name="to"
              control={hf.control}
              rules={{ required: true }}
              render={(field) => (
                <Box sx={{ width: '45%' }}>
                  <HitTimeField label="End time *" floatingLabel={false} ampm {...field} />
                </Box>
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
