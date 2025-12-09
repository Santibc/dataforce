import { Box } from '@mui/material';
import React, { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config';
import { CompanyInfoForm } from './components/CompanyInfoForm';
import { OwnerInfoForm } from './components/OwnerInfoForm';
import { useAuthContext } from '../auth/useAuthContext';
import { useCompanyInfoQuery, useUpdateCompanyInfoMutation } from 'src/api/companyInfoRepository';
import { useGetLoggedUserQuery } from 'src/api/AuthRepository';

interface AdminInfoUpdatePageProps { }

export const AdminInfoUpdatePage: FC<AdminInfoUpdatePageProps> = (props) => {
    const auth = useGetLoggedUserQuery();
    const company_id = auth.data?.data.company_id;
    console.log(auth.data?.data.company_id);
    const { data } = useCompanyInfoQuery(company_id || 0);
    const { mutateAsync: updateCompanyInfo } = useUpdateCompanyInfoMutation();
    console.log(data);
    return (
        <>
            <Helmet>
                <title> Company information | {APP_NAME}</title>
            </Helmet>
            <Box
                sx={{
                    paddingX: 3,
                }}
            >
                <CompanyInfoForm
                    initialValues={
                        {
                            name: data?.name || '',
                            address: data?.address || '',
                            driver_amount: data?.driver_amount || ' ',
                            fleat_size: data?.fleat_size || '',
                            payroll: data?.payroll || '',
                        }
                    }
                    onSubmit={async (values) => {
                        await updateCompanyInfo({ ...values, id: company_id || 0 });
                    }}
                />
            </Box>
        </>
    );
};
