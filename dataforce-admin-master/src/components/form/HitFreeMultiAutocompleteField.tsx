import {
  Autocomplete,
  AutocompleteProps,
  Box,
  createFilterOptions,
  InputLabel,
  TextField,
  TextFieldProps,
} from '@mui/material';
import { useId } from 'react';
import { FieldPath, FieldValues, Noop, RefCallBack, useFormContext } from 'react-hook-form';
import { BaseFieldProps } from './BaseFieldProps';
import { GridItem } from './GridItem';
import { INPUT_LABEL_DEFAULT_STYLES } from './styles';

export type HitFreeMultiAutocompleteFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = BaseFieldProps<TFieldValues> & {
  textFieldProps?: TextFieldProps;
} & Omit<AutocompleteProps<string, true, false, true>, 'options' | 'renderInput'> & {
  options: string[];
  floatingLabel?: boolean;
  placeholder?: string;
  field: {
    onChange: (...event: any[]) => void;
    onBlur: Noop;
    value: string[];
    name: TName;
    ref: RefCallBack;
  };
};

const filter = createFilterOptions<string>();

/**
 * Mui multi Autocomplete free solo wrapper. It allows to enter any value, not only the ones in the options list.
 * The value must be a string because the user can enter a random string.
 * @param colSpan Column span
 * @param options Options to be displayed in the autocomplete. Only labels must be used to be compatible with the free solo mode.
 * @param label Label to be displayed
 * @param field Arguments supplied by the Controller render method
 * @param fieldState Arguments supplied by the Controller render method
 * @param floatingLabel Optional argument to have a separate label from the input. It is enable by default.
 * @example
 * <Controller
 *    name="roles"
 *    control={hf.control}
 *    render={(field) => <HitFreeMultiAutocompleteField
 *      {...field}
 *      label="Roles"
 *      floatingLabel={false} //if you dont want default floating label
 *      options={["Admin","admin"]}
 *    />}
 *  />
 */

export const HitFreeMultiAutocompleteField = <TValue extends FieldValues>({
  label,
  colSpan,
  options,
  field,
  placeholder,
  floatingLabel = true,
  textFieldProps,
  fieldState,
  ...props
}: HitFreeMultiAutocompleteFieldProps<TValue>) => {
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
        freeSolo
        multiple
        selectOnFocus
        handleHomeEndKeys
        clearOnBlur
        onChange={(ev, value) => {
          if (!value) {
            return;
          }
          if (value.some((v) => v.includes('Add "'))) {
            const addValue = value.map((v) => v.replace('Add "', '').replace('"', ''));
            hf.setValue(field.name, addValue as any);
            return;
          }
          hf.setValue(field.name, value as any);
        }}
        options={options}
        fullWidth
        renderOption={(props, option) =>
          option.includes(`Add "`) ? (
            <Box {...props} sx={{ color: 'primary.main' }} component="li">
              {option}
            </Box>
          ) : (
            <li {...props}>{option}</li>
          )
        }
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          const { inputValue } = params;
          const isExisting = options.some((option) => inputValue === option);
          if (inputValue !== '' && !isExisting) {
            // Suggest the creation of a new value
            filtered.push(`${inputValue}`);
          }
          return filtered;
        }}
        {...props}
        renderInput={(params) => (
          <TextField
            {...params}
            error={!!fieldState.error}
            label={floatingLabel ? label : undefined}
            placeholder={placeholder}
            helperText={fieldState.error?.message ?? ''}
            {...textFieldProps}
          />
        )}
      />
    </GridItem>
  );
};
