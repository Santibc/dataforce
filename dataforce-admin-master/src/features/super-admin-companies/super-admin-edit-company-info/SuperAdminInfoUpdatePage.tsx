import { Box } from '@mui/material';
import React, { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config';
import { CompanyInfoForm } from 'src/features/admin-info-update/components/CompanyInfoForm';
import { useUpdateCompanyInfoMutation } from 'src/api/companyInfoRepository';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSuperAdminCompanyInfoQuery, useSuperAdminUpdateCompanyInfoMutation } from 'src/api/superAdminRepository';

interface SuperAdminInfoUpdatePageProps { }

export const SuperAdminInfoUpdatePage: FC<SuperAdminInfoUpdatePageProps> = (props) => {
    const [searchParams] = useSearchParams();
    const { id } = useParams<{ id: string }>();
    const company_name = searchParams.get('company_name');
    console.log(id);
    const { data } = useSuperAdminCompanyInfoQuery(Number(id) || 0);
    const { mutateAsync: updateCompanyInfo } = useSuperAdminUpdateCompanyInfoMutation();
    console.log(data);
    return (
        <>
            <Helmet>
                <title> {company_name}'s Company information | {APP_NAME}</title>
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
                    title={`${company_name}'s Company information`}
                    onSubmit={async (values) => {
                        await updateCompanyInfo({ ...values, id: Number(id) || 0 });
                    }}
                />
            </Box>
        </>
    );
};