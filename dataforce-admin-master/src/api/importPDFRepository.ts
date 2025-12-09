import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { FileDocument, ICreateImportPDF } from 'src/models/Document';
import { httpClient } from 'src/utils/httpClient';

export class ImportPDFRepository {
  keys = {
    all: () => ['import-pdf'],
    one: (id: number) => ['import-pdf', id],
  };

  create = (jobsite: ICreateImportPDF) =>
    httpClient.post('admin/performance/import', jobsite, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

  get = async () => {
    const { data } = await httpClient.get<FileDocument[]>('admin/documents');
    return data;
  };

  update = ({ id, name }: { id: number; name: string }) =>
    httpClient.put(`admin/documents/${id}`, {
      name: name,
    });

  delete = (id: number) => httpClient.delete(`admin/documents/${id}`);
}

const repo = new ImportPDFRepository();

export const useGetAllDocumentsQuery = () =>
  useQuery({
    queryKey: repo.keys.all(),
    queryFn: repo.get,
  });

export const useUpdateDocumentMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.update,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.all());
      enqueueSnackbar('Document updated successfully!', { variant: 'success' });
    },
  });
};

export const useDeleteDocumentMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.delete,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.all());
      enqueueSnackbar('Document deleted successfully!', { variant: 'success' });
    },
  });
};

export const useImportPDFMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.create,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.all());
      enqueueSnackbar('PDF imported successfully!', { variant: 'success' });
    },
  });
};
