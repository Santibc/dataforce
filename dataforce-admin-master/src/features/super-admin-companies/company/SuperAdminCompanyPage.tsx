import { Box, Button, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Position,
  useInspectCompanyQuery,
  useSuperAdminDeleteJobsiteMutation,
  useSuperAdminDeletePositionMutation,
  useSuperAdminDeleteUserMutation,
  useSuperAdminUpdatePositionMutation,
} from 'src/api/superAdminRepository';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs';
import { IslandModal } from 'src/components/island-modal/IslandModal';
import { APP_NAME } from 'src/config';
import { NewPositionForm } from 'src/features/positions/NewPositionForm';
import useFormHandle from 'src/hooks/useFormHandle';
import useSuperAdminCompanyInspect from 'src/hooks/useSuperAdminCompanyInspect';
import { PATHS } from 'src/routes/paths';
import { CompanySummary } from './data-display-components/CompanySummary';
import { SuperAdminCompanyJobsitesTable } from './table-components/SuperAdminCompanyJobsitesTable';
import { SuperAdminCompanyPositionsTable } from './table-components/SuperAdminCompanyPositionsTable';
import { SuperAdminCompanyUsersTable } from './table-components/SuperAdminCompanyUsersTable';

interface SuperAdminCompanyPageProps {}

export const SuperAdminCompanyPage: FC<SuperAdminCompanyPageProps> = (props) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: companyData } = useInspectCompanyQuery(id || 0);
  const { mutateAsync: deleteJobsite } = useSuperAdminDeleteJobsiteMutation();
  const { isEditing, editingData, edit, close } = useFormHandle<Position>();
  const { mutateAsync: editPosition } = useSuperAdminUpdatePositionMutation();
  const { mutateAsync: deletePosition } = useSuperAdminDeletePositionMutation();
  const { mutateAsync: deleteUser } = useSuperAdminDeleteUserMutation();

  const { handleOnInspect, isLoading } = useSuperAdminCompanyInspect();

  return (
    <>
      <Helmet>
        <title>Super Admin Panel | {APP_NAME}</title>
      </Helmet>
      <Box sx={{ paddingX: 3 }}>
        <Box sx={{ pb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h3">Company panel</Typography>
            <Button variant="contained" onClick={handleOnInspect} disabled={isLoading}>
              Inspect company
            </Button>
          </Box>
          <Typography variant="h5" color="grey">
            Current company: {companyData?.name || 'Loading...'}
          </Typography>
          <CustomBreadcrumbs
            sx={{ pb: 0, mb: 0 }}
            links={[
              { name: 'Superadmin Panel', href: PATHS.superAdmin.root },
              { name: 'Company Panel' },
            ]}
          />
        </Box>
        <Box>
          <CompanySummary
            positions={{
              hex: '#4d4d4d',
              status: `${
                companyData?.positions.length === undefined
                  ? 'Loading...'
                  : companyData?.positions.length
              }`,
            }}
            jobsites={{
              status: `${
                companyData?.jobsites.length === undefined
                  ? 'Loading...'
                  : companyData?.jobsites.length
              }`,
              hex: '#4d4d4d',
            }}
            users={{
              status: `${
                companyData?.users.length === undefined ? 'Loading...' : companyData?.users.length
              }`,
              hex: '#4d4d4d',
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, pt: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ pb: 2 }}>
              Company Jobsites
            </Typography>
            <SuperAdminCompanyJobsitesTable
              data={companyData?.jobsites || []}
              isLoading={false}
              onDelete={async (id) => {
                await deleteJobsite(id);
                qc.invalidateQueries(['company']);
              }}
              onEdit={(id) => {
                navigate(PATHS.superAdmin.jobsite(id));
              }}
              onSelectUniversidad={(id) => {}}
            />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ pb: 2 }}>
              Company Positions
            </Typography>
            <SuperAdminCompanyPositionsTable
              data={companyData?.positions || []}
              isLoading={false}
              onDelete={async (id) => {
                if (companyData?.positions === undefined) return;
                const found = companyData?.positions.find((data) => data.id === id);
                if (found !== undefined) {
                  await deletePosition(found.id);
                  qc.invalidateQueries(['company']);
                }
              }}
              onEdit={(id) => {
                if (companyData?.positions === undefined) return;
                const found = companyData?.positions.find((data) => data.id === id);
                if (found !== undefined) edit(found);
              }}
              onSelectUniversidad={(id) => {}}
            />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ pb: 2 }}>
              Company Users
            </Typography>
            <SuperAdminCompanyUsersTable
              data={companyData?.users || []}
              isLoading={false}
              onDelete={async (id) => {
                await deleteUser(id);
                qc.invalidateQueries(['company']);
              }}
              onEdit={(id) => {
                if (companyData?.users === undefined) return;
                const found = companyData?.users.find((data) => data.id === id);
                if (found !== undefined) {
                  navigate(
                    `${PATHS.superAdmin.user(`${id}`)}?company_id=${
                      companyData?.id || 0
                    }&user=${JSON.stringify(found)}`
                  );
                  qc.invalidateQueries(['company']);
                }
              }}
              onSelectedModels={() => {}}
            />
          </Box>
        </Box>
      </Box>
      {isEditing && (
        <IslandModal open={isEditing} onClose={close} maxWidth="600px">
          <NewPositionForm
            initialValues={editingData ? editingData : undefined}
            onSubmit={async (values) => {
              await editPosition({
                ...values,
                from: values.from!,
                to: values.to!,
              });
              console.log('here');
              qc.invalidateQueries(['company']);
              close();
            }}
            edit
            onClose={close}
          />
        </IslandModal>
      )}
    </>
  );
};
