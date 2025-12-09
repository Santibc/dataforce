import { Box, Typography } from '@mui/material';
import { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import {
  useAllCompaniesQuery,
  useSuperAdminDeleteCompanyMutation,
} from 'src/api/superAdminRepository';
import { APP_NAME } from 'src/config';
import { PATHS } from 'src/routes/paths';
import { SuperAdminCompaniesTable } from './SuperAdminCompaniesTable';

interface SuperAdminCompaniesPageProps {}

export const SuperAdminCompaniesPage: FC<SuperAdminCompaniesPageProps> = (props) => {
  const { data: companiesData } = useAllCompaniesQuery();
  const { mutateAsync: deleteCompany } = useSuperAdminDeleteCompanyMutation();
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>Super Admin Panel | {APP_NAME}</title>
      </Helmet>
      <Box sx={{ paddingX: 3 }}>
        <Box sx={{ pb: 3 }}>
          <Typography variant="h3">Super admin panel</Typography>
        </Box>
        <Box>
          <Typography variant="h4" sx={{ pb: 2 }}>
            Companies
          </Typography>
          <SuperAdminCompaniesTable
            data={companiesData ?? []}
            onDelete={async (id) => {
              if (companiesData === undefined) return;
              const found = companiesData?.find((data) => data.id === id);
              if (found !== undefined) {
                await deleteCompany(found.id);
              }
            }}
            onEdit={(id) => {
              if (companiesData === undefined) return;
              const found = companiesData?.find((data) => data.id === id);
              if (found !== undefined)
                navigate(`${PATHS.superAdmin.companyinfo(id)}?company_name=${found.name}`);
            }}
            onSelectRow={(id) => {}}
            onInspectCompany={(id) => navigate(PATHS.superAdmin.company(id))}
          />
        </Box>
      </Box>
    </>
  );
};
