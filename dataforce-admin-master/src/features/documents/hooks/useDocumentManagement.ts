import React from 'react';
import {
  useDeleteDocumentMutation,
  useGetAllDocumentsQuery,
  useImportPDFMutation,
  useUpdateDocumentMutation,
} from 'src/api/importPDFRepository';
import { FileDocument } from 'src/models/Document';
import { EditFileFields } from '../Forms/EditFileForm.types';
import { ImportPDFFormFields } from '../ImportFileFormForm';

export const useDocumentManagement = () => {
  const [importOpen, setImportOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = React.useState<FileDocument>();

  const { mutateAsync: importPDF } = useImportPDFMutation();
  const { mutateAsync: deletePDF } = useDeleteDocumentMutation();
  const { mutateAsync: updatePDF } = useUpdateDocumentMutation();
  const { data = [] } = useGetAllDocumentsQuery();

  const handleDelete = async (id: number) => {
    await deletePDF(id, { onSuccess: () => setIsEditing(false) });
  };

  const handleUpdate = (id: number) => async (values: EditFileFields) => {
    await updatePDF({ id, name: values.name }, { onSuccess: () => setIsEditing(false) });
  };

  const handleImport = async (values: ImportPDFFormFields) => {
    await importPDF(values.pdf, { onSuccess: () => setImportOpen(false) });
    setImportOpen(false);
  };

  const handleOnEdit = (documentId: number) => {
    const selected = data.find((d) => d.id === documentId);
    setSelectedDocument(selected);
    setIsEditing(true);
  };

  const handleEditModal = () => {
    setIsEditing(!isEditing);
  };

  const handleImportModal = () => {
    setImportOpen(!importOpen);
  };

  return {
    importOpen,
    isEditing,
    selectedDocument,
    importPDF,
    deletePDF,
    updatePDF,
    documents: data,
    handleOnDelete: handleDelete,
    handleOnUpdate: handleUpdate,
    handleOnImport: handleImport,
    handleOnEdit,
    handleOnEditModal: handleEditModal,
    handleOnImportModal: handleImportModal,
  };
};
