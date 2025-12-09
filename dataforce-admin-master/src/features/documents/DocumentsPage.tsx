import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ImCloudUpload } from 'react-icons/im';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs';
import { IslandModal } from 'src/components/island-modal/IslandModal';
import { APP_NAME } from 'src/config';
import { PATHS } from 'src/routes/paths';
import { DocumentsTable } from './DocumentsTable';
import EditFileForm from './Forms/EditFileForm';
import { ImportFileFormForm } from './ImportFileFormForm';
import { useDocumentManagement } from './hooks/useDocumentManagement';

export const DocumentsPage: React.FC = () => {
  const documentManagement = useDocumentManagement();

  return (
    <>
      <Helmet>
        <title> Documents | {APP_NAME}</title>
      </Helmet>
      <Box sx={{ paddingX: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h3">Documents</Typography>
          <Button
            startIcon={<ImCloudUpload size={20} />}
            variant="contained"
            onClick={documentManagement.handleOnImportModal}
          >
            Upload
          </Button>
        </Box>
        <CustomBreadcrumbs
          links={[
            { href: PATHS.dashboard.schedule.root, name: 'Dashboard' },
            { name: 'Documents' },
          ]}
        />
        <Box pb="10px" />
        <DocumentsTable
          data={documentManagement.documents}
          onDelete={documentManagement.handleOnDelete}
          onEdit={documentManagement.handleOnEdit}
          onSelectRow={() => {}}
        />
        <IslandModal
          onClose={documentManagement.handleOnImportModal}
          open={documentManagement.importOpen}
        >
          <ImportFileFormForm onSubmit={documentManagement.handleOnImport} />
        </IslandModal>
        {documentManagement.selectedDocument && (
          <IslandModal
            open={documentManagement.isEditing}
            onClose={documentManagement.handleOnEditModal}
            maxWidth="600px"
          >
            <EditFileForm
              initialValues={{ name: documentManagement.selectedDocument.name }}
              handleOnUpdate={documentManagement.handleOnUpdate(
                documentManagement.selectedDocument.id
              )}
              onClose={documentManagement.handleOnImportModal}
            />
          </IslandModal>
        )}
      </Box>
    </>
  );
};
