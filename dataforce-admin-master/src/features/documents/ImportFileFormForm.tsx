import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@mui/material';
import React, { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    HitFileField,
    HitForm,
    HitFormActions,
    HitFormSubmitButton,
} from 'src/components/form';
import * as Yup from 'yup';
import { Typography } from '@mui/material';

export interface ImportPDFFormProps {
    initialValues?: ImportPDFFormFields;
    edit?: boolean;
    onSubmit: (values: ImportPDFFormFields) => Promise<any>;
}

export interface ImportPDFFormFields {
    pdf: {
        file: File;
    };
}

const defaultValues: ImportPDFFormFields = {
    pdf: {
        file: '' as unknown as File,
    },
};

const ImportFileFormFieldsSchema = Yup.object().shape({
    pdf: Yup.mixed().test('is_file_selected', 'The pdf file is required', function (value) {
        if (!value || !value.file) {
            return this.createError({ message: 'The pdf file is required' });
        }
        return true;
    }).test('is-pdf-file', 'The file must have a .pdf extension', function (value) {
        const fileName = value.file.name;
        const fileExtension = fileName.split('.').pop().toLowerCase();
        if (fileExtension !== 'pdf') {
            return this.createError({ message: 'The pdf file must have an .pdf extension' });
        }
        return true;
    }),
});

export const ImportFileFormForm: FC<ImportPDFFormProps> = ({
    initialValues,
    onSubmit,
    edit,
}) => {
    const hf = useForm<ImportPDFFormFields>({
        defaultValues,
        values: initialValues,
        mode: 'onBlur',
        resolver: yupResolver(ImportFileFormFieldsSchema),
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
                        maxHeight: '700px',
                        overflowY: 'auto',
                    }}
                >
                    <Typography variant="h5" py="18px">Import PDF</Typography>
                    <Controller
                        name="pdf"
                        control={hf.control}
                        rules={{ required: true }}
                        render={(field) => (
                            <Box sx={{ marginBottom: '20px', color: hf.formState.errors.pdf ? "red" : "" }}>
                                <HitFileField {...field} label="PDF *" floatingLabel={false} />
                            </Box>
                        )}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <HitFormActions>
                            <HitFormSubmitButton>Import</HitFormSubmitButton>
                        </HitFormActions>
                    </Box>
                </Box>
            </HitForm>
        </Box>
    );
};