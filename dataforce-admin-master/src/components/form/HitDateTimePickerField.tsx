import { InputLabel, TextFieldProps } from '@mui/material';
import { DateTimePicker, DateTimePickerProps } from '@mui/x-date-pickers';
import { Moment } from 'moment';
import { useId } from 'react';
import { FieldPath, FieldValues, Noop, RefCallBack } from 'react-hook-form';
import { BaseFieldProps } from './BaseFieldProps';
import { GridItem } from './GridItem';
import { INPUT_LABEL_DEFAULT_STYLES } from './styles';

export type HitDateTimePickerFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = BaseFieldProps<TFieldValues> & {
  textFieldProps?: TextFieldProps;
} & Omit<DateTimePickerProps<any>, 'onChange' | 'value'> &
  React.RefAttributes<HTMLDivElement> & {
    floatingLabel?: boolean;
    field: {
      onChange: (...event: any[]) => void;
      onBlur: Noop;
      value: Moment | '';
      name: TName;
      ref: RefCallBack;
    };
  };

/**
 * Mui DateTimePicker wrapper.
 * @param colSpan Column span
 * @param floatingLabel Optional argument to have a separate label from the input. It is enable by default.
 * @param textFieldProps Props to be passed to the TextField component
 * @param field Arguments supplied by the Controller render method
 * @param fieldState Arguments supplied by the Controller render method
 * @example
 * <Controller
 *    name="birthdate"
 *    control={hf.control}
 *    floatingLabel={false} //if you dont want default floating label
 *    render={(field) => <HitDateTimePickerField {...field} label="Birthdate"/>}
 *  />
 */

export const HitDateTimePickerField = <TValue extends FieldValues>({
  label,
  colSpan,
  floatingLabel = true,
  field,
  fieldState,
  textFieldProps,
  ...props
}: HitDateTimePickerFieldProps<TValue>) => {
  const id = useId();
  return (
    <GridItem colSpan={colSpan}>
      {!floatingLabel ? (
        <InputLabel htmlFor={id} sx={INPUT_LABEL_DEFAULT_STYLES} error={!!fieldState.error}>
          {label}
        </InputLabel>
      ) : null}
      <DateTimePicker
        format="DD/MM/YYYY hh:mm"
        slotProps={{
          textField: {
            id,
            fullWidth: true,
            error: !!fieldState.error,
            helperText: fieldState.error?.message ?? '',
            ...textFieldProps,
          },
        }}
        {...field}
        {...props}
      />
    </GridItem>
  );
};
