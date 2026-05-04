import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { IAttachmentInput } from 'app/api/chatRepository';

const MAX_SIZE_BYTES = 10 * 1024 * 1024;

const DOCUMENT_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

const fileNameFromUri = (uri: string, fallbackExt: string) => {
  const last = uri.split('/').pop();
  if (last && last.includes('.')) return last;
  return `file.${fallbackExt}`;
};

const enforceSizeLimit = (size: number | undefined): boolean => {
  if (size && size > MAX_SIZE_BYTES) {
    Alert.alert(
      'Archivo demasiado grande',
      'El tamaño máximo permitido por adjunto es 10 MB.',
    );
    return false;
  }
  return true;
};

export const pickImage = async (): Promise<IAttachmentInput | null> => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    Alert.alert(
      'Permiso requerido',
      'Concede permiso a la galería para adjuntar imágenes.',
    );
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.7,
    allowsMultipleSelection: false,
  });

  if (result.canceled || !result.assets?.length) return null;

  const asset = result.assets[0];
  if (!enforceSizeLimit(asset.fileSize)) return null;

  const mime = asset.mimeType || 'image/jpeg';
  const ext = mime.split('/')[1] || 'jpg';

  return {
    uri: asset.uri,
    name: asset.fileName || fileNameFromUri(asset.uri, ext),
    mime_type: mime,
    size: asset.fileSize,
  };
};

export const pickDocument = async (): Promise<IAttachmentInput | null> => {
  const result = await DocumentPicker.getDocumentAsync({
    type: DOCUMENT_MIME_TYPES,
    copyToCacheDirectory: true,
    multiple: false,
  });

  if (result.canceled || !result.assets?.length) return null;

  const asset = result.assets[0];
  if (!enforceSizeLimit(asset.size)) return null;

  const mime = asset.mimeType || 'application/octet-stream';

  if (!DOCUMENT_MIME_TYPES.includes(mime)) {
    Alert.alert(
      'Formato no permitido',
      'Solo se admiten PDF, Word y Excel como documentos.',
    );
    return null;
  }

  return {
    uri: asset.uri,
    name: asset.name || fileNameFromUri(asset.uri, 'bin'),
    mime_type: mime,
    size: asset.size,
  };
};
