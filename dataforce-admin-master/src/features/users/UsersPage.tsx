import { Box, Button, Typography } from '@mui/material';
import React, { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaCloudDownloadAlt, FaCloudUploadAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {
  useAllUsersQuery,
  useDeleteUserMutation,
  useImportExcelMutation,
} from 'src/api/usersRepository';
import templateUsers from 'src/assets/excel/template_users.xlsx';
import { IslandModal } from 'src/components/island-modal/IslandModal';
import { ModalTitleHeader } from 'src/components/modal-header-with-close-button/ModalTitleHeader';
import { APP_NAME } from 'src/config';
import { PATHS } from 'src/routes/paths';
import { ImportExcelFormForm } from './ImportExcelModal';
import { UsersTable } from './UsersTable';

interface UsersPageProps {}

const handleDownload = () => {
  // Define the file URL (replace 'fileURL' with the actual URL of your file)
  const fileURL = templateUsers;
  console.log('This is the file URL: ', fileURL);

  // Create an anchor element
  const anchor = document.createElement('a');

  // Set the anchor's href attribute to the file URL
  anchor.href = fileURL;

  // Set the anchor's download attribute to prompt the browser to download the file
  anchor.download = 'template_users.xlsx'; // Replace 'filename.pdf' with the desired file name

  // Append the anchor to the document body
  document.body.appendChild(anchor);

  // Simulate a click on the anchor element to trigger the download
  anchor.click();

  // Remove the anchor from the document body
  document.body.removeChild(anchor);
};

export const UsersPage: FC<UsersPageProps> = (props) => {
  const [importOpen, setImportOpen] = React.useState(false);
  const { data: usersData } = useAllUsersQuery();
  const { mutateAsync: deleteUser } = useDeleteUserMutation();
  const { mutateAsync: importExcel } = useImportExcelMutation();
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        paddingX: 3,
      }}
    >
      <Helmet>
        <title> Users | {APP_NAME}</title>
      </Helmet>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: '2.5rem',
        }}
      >
        <Typography variant="h3">Users</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" onClick={() => navigate('/dashboard/users/create')}>
            Create New User
          </Button>
          <Button variant="outlined" onClick={() => setImportOpen(true)}>
            <FaCloudUploadAlt size={20} style={{ marginRight: 8 }} />
            Import
          </Button>
        </Box>
      </Box>
      <UsersTable
        data={usersData || []}
        isLoading={false}
        onDelete={(id) => deleteUser(id)}
        onEdit={(id) => {
          navigate(PATHS.dashboard.users.edit(`${id}`));
        }}
        onSelectedModels={() => {}}
      />
      <IslandModal onClose={() => setImportOpen(false)} open={importOpen}>
        <Box sx={{ marginTop: '-20px' }} />
        <ModalTitleHeader
          title="Download import Excel template"
          onClose={() => setImportOpen(false)}
        />
        <Button variant="contained" onClick={() => handleDownload()} sx={{ mb: 2 }}>
          <FaCloudDownloadAlt size={20} style={{ marginRight: 8 }} />
          Download
        </Button>
        <ImportExcelFormForm
          onSubmit={async (values) => {
            await importExcel(values.excel);
            setImportOpen(false);
          }}
        />
      </IslandModal>
    </Box>
  );
};
