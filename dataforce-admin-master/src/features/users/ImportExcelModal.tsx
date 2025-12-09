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
import { ModalTitleHeader } from 'src/components/modal-header-with-close-button/ModalTitleHeader';
import * as Yup from 'yup';
import { Typography } from '@mui/material';

export interface ImportExcelFormProps {
    initialValues?: ImportExcelFormFields;
    edit?: boolean;
    onSubmit: (values: ImportExcelFormFields) => Promise<any>;
}

export interface ImportExcelFormFields {
    excel: {
        file: File;
    };
}

const defaultValues: ImportExcelFormFields = {
    excel: {
        file: '' as unknown as File,
    },
};

const ImportExcelFormFieldsSchema = Yup.object().shape({
    excel: Yup.mixed().test('is_file_selected', 'The excel file is required', function (value) {
        if (!value || !value.file) {
            return this.createError({ message: 'The excel file is required' });
        }
        return true;
    }).test('is-excel-file', 'The file must have an .xlsx extension', function (value) {
        const fileName = value.file.name;
        const fileExtension = fileName.split('.').pop().toLowerCase();
        if (fileExtension !== 'xlsx') {
            return this.createError({ message: 'The excel file must have an .xlsx extension' });
        }
        return true;
    }),
});

export const ImportExcelFormForm: FC<ImportExcelFormProps> = ({
    initialValues,
    onSubmit,
    edit,
}) => {
    const hf = useForm<ImportExcelFormFields>({
        defaultValues,
        values: initialValues,
        mode: 'onBlur',
        resolver: yupResolver(ImportExcelFormFieldsSchema),
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
                    <Typography variant="h5" py="18px">Import Excel</Typography>
                    <Controller
                        name="excel"
                        control={hf.control}
                        rules={{ required: true }}
                        render={(field) => (
                            <Box sx={{ marginBottom: '20px', color: hf.formState.errors.excel ? "red" : "" }}>
                                <HitFileField {...field} label="Excel *" floatingLabel={false} />
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
