import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, FormHelperText } from '@mui/material';
import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  GridItem,
  HitForm,
  HitFormActions,
  HitFormSubmitButton,
  HitMultiAutocompleteField,
  HitTextField,
} from 'src/components/form';
import { ModalTitleHeader } from 'src/components/modal-header-with-close-button/ModalTitleHeader';
import { TABS } from 'src/features/coaching/CoachingPage';
import * as Yup from 'yup';
import '../styles.css';

export interface SendCoachingEmailFormProps {
  initialValues?: SendCoachingEmailFormFields;
  emailsTo: {
    value: number;
    label: string;
  }[];
  edit?: boolean;
  onSubmit: (values: SendCoachingEmailFormFields) => Promise<any>;
  onClose: () => void;
}

export interface SendCoachingEmailFormFields {
  subject: string;
  emailContent: string;
  emailTo: number[];
  week: number;
  column: string;
}

const defaultValues: SendCoachingEmailFormFields = {
  subject: '',
  emailContent: '',
  emailTo: [],
  week: 0,
  column: '',
};

const SendEmailFormFieldsSchema = Yup.object().shape({
  subject: Yup.string().required('Subject is required'),
  emailContent: Yup.string().required('Content is required'),
  emailTo: Yup.array().min(1, 'Choose at least one email').required('To is required'),
  week: Yup.number().required(),
});

export const SendCoachingEmailForm: FC<SendCoachingEmailFormProps> = ({
  initialValues,
  onSubmit,
  emailsTo = [],
  onClose,
}) => {
  const hf = useForm<SendCoachingEmailFormFields>({
    defaultValues,
    values: initialValues,
    mode: 'onBlur',
    resolver: yupResolver(SendEmailFormFieldsSchema),
  });
  const tabArray = Object.entries(TABS).map(([value, label]) => ({ value, label }));
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
          }}
        >
          <ModalTitleHeader title="Send coach email" variant="h5" onClose={onClose} />
          <Controller
            name="emailTo"
            control={hf.control}
            rules={{ required: true }}
            render={(field) => (
              <HitMultiAutocompleteField
                {...field}
                floatingLabel={false}
                label="To *"
                sx={{ marginBottom: '15px' }}
                options={emailsTo}
              />
            )}
          />
          <Controller
            name="subject"
            control={hf.control}
            rules={{ required: true }}
            render={(field) => (
              <HitTextField
                {...field}
                placeholder="Great job!"
                floatingLabel={false}
                sx={{ marginBottom: '20px' }}
                label="Subject *"
              />
            )}
          />
          <Controller
            name="emailContent"
            control={hf.control}
            rules={{ required: true }}
            render={(field) => (
              <GridItem colSpan={{ xs: 12 }}>
                <>
                  <CKEditor
                    editor={ClassicEditor as { create: (args: any) => Promise<ClassicEditor> }}
                    data={field.field.value}
                    onChange={(event, editor) => {
                      const data = (editor as any).getData();
                      field.field.onChange(data);
                    }}
                    onBlur={(event, editor) => {
                      field.field.onBlur();
                    }}
                    onFocus={(event, editor) => {}}
                    config={{
                      removePlugins: ['ImageUpload', 'MediaEmbed', 'EasyImage', 'Table'],
                    }}
                  />
                  {field.fieldState.error && (
                    <FormHelperText error>{field.fieldState.error.message}</FormHelperText>
                  )}
                </>
              </GridItem>
            )}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              paddingTop: '20px',
            }}
          >
            <HitFormActions>
              <HitFormSubmitButton>Send</HitFormSubmitButton>
            </HitFormActions>
          </Box>
        </Box>
      </HitForm>
    </Box>
  );
};
