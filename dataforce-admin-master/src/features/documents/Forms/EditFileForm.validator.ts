import * as Yup from 'yup';

export const editDocumentFieldsSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
});
