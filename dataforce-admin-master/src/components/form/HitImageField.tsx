import { FormLabel } from '@mui/material';
import Compressor from 'compressorjs';
import { FieldPath, FieldValues, Noop, RefCallBack } from 'react-hook-form';
import { Upload } from '../upload';
import { BaseFieldProps } from './BaseFieldProps';
import { GridItem } from './GridItem';
import { INPUT_LABEL_DEFAULT_STYLES } from './styles';

export type SimpleImageFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = BaseFieldProps<TFieldValues> & {
  field: {
    onChange: (...event: any[]) => void;
    onBlur: Noop;
    value: { file: File | null | string };
    name: TName;
    ref: RefCallBack;
  };
  floatingLabel?: boolean;
};

export const HitImageField = <TValue extends FieldValues>({
  label,
  colSpan,
  field,
  floatingLabel = true,
  fieldState,
}: SimpleImageFieldProps<TValue>) => (
  <GridItem colSpan={colSpan}>
    <>
      <FormLabel
        sx={!floatingLabel ? INPUT_LABEL_DEFAULT_STYLES : undefined}
        error={!!fieldState.error}
      >
        {label}
      </FormLabel>
      <Upload
        multiple={false}
        sx={{ width: '100%', marginTop: !floatingLabel ? 1 : undefined }}
        error={!!fieldState.error}
        helperText={fieldState.error?.message ?? ''}
        file={field.value.file}
        onDrop={(value) => {
          new Compressor(value[0], {
            maxWidth: 800,
            maxHeight: 800,
            convertSize: 1000000,
            success(result: any) {
              var file = new File([result], result.name);
              field.onChange({ file });
            },
          });
        }}
        onDelete={() => field.onChange({ file: null })}
        accept={{ 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] }}
        {...field}
      />
    </>
  </GridItem>
);
