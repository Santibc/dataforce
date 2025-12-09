import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  AutocompleteProps,
  Box,
  Button,
  createFilterOptions,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  TextField,
  TextFieldProps,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { FieldPath, FieldValues, Noop, RefCallBack, useFormContext } from 'react-hook-form';
import { useConfirm } from '../confirm-action/ConfirmAction';
import { BaseFieldProps } from './BaseFieldProps';
import { GridItem } from './GridItem';

export type HitCRUDAutocompleteFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = BaseFieldProps<TFieldValues> & {
  textFieldProps?: TextFieldProps;
} & Omit<AutocompleteProps<string, true, false, true>, 'options' | 'renderInput'> & {
    onDelete: (option: string) => Promise<any>;
    onEdit: (arg: { prevValue: string; newValue: string }) => Promise<any>;
    onCreate: (option: string) => Promise<any>;
    options: string[];
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
 * Mui multi Autocomplete free solo wrapper with CRUD operations. It allows to enter any value, not only the ones in the options list.
 * The value must be a string because the user can enter a random string.
 * @param colSpan Column span
 * @param options Options to be displayed in the autocomplete. Only labels must be used to be compatible with the free solo mode.
 * @param label Label to be displayed
 * @param field Arguments supplied by the Controller render method
 * @param fieldState Arguments supplied by the Controller render method
 * @param onDelete Delete item function
 * @param onEdit Edit item function
 * @param onCreate Create item function
 * @example
 * <Controller
 *    name="roles"
 *    control={hf.control}
 *    render={(field) => <HitFreeMultiAutocompleteField
 *      {...field}
 *      label="Roles"
 *      options={["Admin","admin"]}
 *      onDelete={deleteMutation.mutateAsync}
 *      onEdit={editMutation.mutateAsync}
 *      onCreate={createMutation.mutateAsync}
 *    />}
 *  />
 */

export const HitCRUDAutocompleteField = <TValue extends FieldValues>({
  label,
  colSpan,
  options,
  field,
  textFieldProps,
  onDelete,
  onEdit,
  onCreate,
  fieldState,
  ...props
}: HitCRUDAutocompleteFieldProps<TValue>) => {
  const inputRef = useRef(null);
  const confirm = useConfirm();
  const hf = useFormContext();
  const editMutation = useMutation({ mutationFn: onEdit });
  const createMutation = useMutation({ mutationFn: onCreate });
  const [editValue, setEditValue] = useState<string | undefined>();
  return (
    <GridItem colSpan={colSpan}>
      <Autocomplete
        {...field}
        openOnFocus
        freeSolo
        multiple
        selectOnFocus
        handleHomeEndKeys
        loading={createMutation.isLoading}
        clearOnBlur
        loadingText="Loading..."
        onChange={async (ev, value) => {
          if (!value) {
            return;
          }
          if (value.some((v) => v.includes('Add "'))) {
            const newValue = value
              .find((v) => v.includes('Add "'))!
              .replace('Add "', '')
              .replace('"', '');
            const addValue = value.map((v) => v.replace('Add "', '').replace('"', ''));
            await createMutation.mutateAsync(newValue);
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
            <Box
              {...props}
              sx={{
                display: 'flex',
                width: '100%',
              }}
              style={{ justifyContent: 'space-between' }}
              component="li"
            >
              {option}
              <div>
                <IconButton
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setEditValue(option);
                  }}
                >
                  <Icon icon="heroicons:pencil" height={14} />
                </IconButton>
                <IconButton
                  onClick={(ev) => {
                    ev.stopPropagation();

                    confirm({
                      action: async () => {
                        await onDelete(option);
                        hf.setValue(field.name, field.value.filter((x) => x !== option) as any);
                      },
                    });
                  }}
                >
                  <Icon icon="heroicons:x-mark" height={14} />
                </IconButton>
              </div>
            </Box>
          )
        }
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          const { inputValue } = params;
          const isExisting = options.some((option) => inputValue === option);
          if (inputValue !== '' && !isExisting) {
            // Suggest the creation of a new value
            filtered.push(`Add "${inputValue}"`);
          }
          return filtered;
        }}
        {...props}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            error={!!fieldState.error}
            helperText={fieldState.error?.message ?? ''}
            {...textFieldProps}
          />
        )}
      />
      <Dialog open={editValue !== undefined} onClose={() => setEditValue(undefined)}>
        <DialogContent>
          <TextField
            fullWidth
            sx={{ mt: 6 }}
            hiddenLabel
            autoFocus
            defaultValue={editValue}
            inputRef={inputRef}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditValue(undefined)}>Cancel</Button>
          <LoadingButton
            onClick={async () => {
              const newValue = (inputRef.current as any).value;
              await editMutation.mutateAsync({
                prevValue: editValue!,
                newValue,
              });
              setEditValue(undefined);
              hf.setValue(
                field.name,
                field.value.map((x) => (x === editValue ? newValue : x)) as any
              );
              (inputRef.current as any)?.focus();
            }}
            variant="contained"
            disabled={editValue === '' || editMutation.isLoading}
            loading={editMutation.isLoading}
          >
            Save
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </GridItem>
  );
};
