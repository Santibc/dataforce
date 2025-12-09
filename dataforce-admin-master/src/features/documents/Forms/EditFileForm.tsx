import React from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { HitForm, HitFormActions, HitFormSubmitButton, HitTextField } from 'src/components/form';
import { ModalTitleHeader } from 'src/components/modal-header-with-close-button/ModalTitleHeader';
import { EditFileFields } from './EditFileForm.types';
import { editDocumentFieldsSchema } from './EditFileForm.validator';

interface EditFileFormProps {
  initialValues: EditFileFields;
  handleOnUpdate: (values: EditFileFields) => Promise<void>;
  onClose: () => void;
}

const EditFileForm: React.FC<EditFileFormProps> = ({ initialValues, handleOnUpdate, onClose }) => {
  const hf = useForm<EditFileFields>({
    defaultValues: {
      name: '',
    },
    values: initialValues,
    mode: 'onBlur',
    resolver: yupResolver(editDocumentFieldsSchema),
  });

  return (
    <Box>
      <HitForm hf={hf} onSubmit={handleOnUpdate}>
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
          <ModalTitleHeader title="Edit document" onClose={onClose} />
          <Box sx={{ display: 'flex' }}>
            <Controller
              name="name"
              control={hf.control}
              rules={{ required: true }}
              render={(field) => (
                <Box sx={{ display: 'flex', width: '100%' }}>
                  <HitTextField
                    {...field}
                    label="Name *"
                    floatingLabel={false}
                    sx={{ marginBottom: '20px' }}
                  />
                </Box>
              )}
            />
          </Box>
          <Box>
            <HitFormActions>
              <HitFormSubmitButton>Save</HitFormSubmitButton>
            </HitFormActions>
          </Box>
        </Box>
      </HitForm>
    </Box>
  );
};

export default EditFileForm;
