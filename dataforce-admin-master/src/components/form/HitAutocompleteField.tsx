import {
  Autocomplete,
  AutocompleteProps,
  InputLabel,
  TextField,
  TextFieldProps,
} from '@mui/material';
import { useId } from 'react';
import {
  FieldPath,
  FieldPathValue,
  FieldValues,
  Noop,
  RefCallBack,
  useFormContext,
} from 'react-hook-form';
import { BaseFieldProps } from './BaseFieldProps';
import { GridItem } from './GridItem';
import { INPUT_LABEL_DEFAULT_STYLES } from './styles';

export type HitAutocompleteFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = BaseFieldProps<TFieldValues> & {
  textFieldProps?: TextFieldProps;
} & Omit<
    AutocompleteProps<FieldPathValue<TFieldValues, TName>, false, false, false>,
    'options' | 'renderInput'
  > & {
    options: { value: FieldPathValue<TFieldValues, TName>; label: string }[];
    placeholder?: string;
    floatingLabel?: boolean;
    field: {
      onChange: (...event: any[]) => void;
      onBlur: Noop;
      value: FieldPathValue<TFieldValues, TName>;
      name: TName;
      ref: RefCallBack;
    };
  };

/**
 * Mui Autocomplete wrapper. Check HitFreeSoloAutocomplete for arbitraty values or HitMutiAutocompleteField for selecting multiple values and creteing new ones.
 * @param colSpan Column span
 * @param options Options to be displayed in the autocomplete
 * @param label Label to be displayed
 * @param field Arguments supplied by the Controller render method
 * @param fieldState Arguments supplied by the Controller render method
 * @param floatingLabel Optional argument to have a separate label from the input.
 * @example
 * <Controller
 *    name="role"
 *    control={hf.control}
 *    render={(field) => <HitAutocompleteField
 *      {...field}
 *      label="Role"
 *      floatingLabel={false} //if you dont want default floating label
 *      options={[{label: "Admin", value: "admin"}]}
 *    />}
 *  />
 */

export const HitAutocompleteField = <TValue extends FieldValues>({
  label,
  colSpan,
  options,
  field,
  placeholder,
  floatingLabel = true,
  textFieldProps,
  fieldState,
  ...props
}: HitAutocompleteFieldProps<TValue>) => {
  const hf = useFormContext();
  const id = useId();
  return (
    <GridItem colSpan={colSpan}>
      {!floatingLabel ? (
        <InputLabel htmlFor={id} sx={INPUT_LABEL_DEFAULT_STYLES} error={!!fieldState.error}>
          {label}
        </InputLabel>
      ) : null}
      <Autocomplete
        {...field}
        id={id}
        onChange={(ev, value) => value && hf.setValue(field.name, value)}
        options={options.map((option) => option.value)}
        getOptionLabel={(value) => options.find((option) => option.value === value)?.label ?? ''}
        fullWidth
        {...props}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            label={floatingLabel ? label : undefined}
            error={!!fieldState.error}
            helperText={fieldState.error?.message ?? ''}
            {...textFieldProps}
          />
        )}
      />
    </GridItem>
  );
};
