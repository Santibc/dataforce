//
import Image from '../../image';

// ----------------------------------------------------------------------
import { Stack, Typography } from '@mui/material';
import doc_icon from 'src/assets/doc_icon.svg';
import file_icon from 'src/assets/file_icon.png';
import gif_icon from 'src/assets/gif_icon.png';
import mp3_icon from 'src/assets/mp3_icon.png';
import pdf_icon from 'src/assets/pdf_icon.png';
import ppt_icon from 'src/assets/ppt_icon.svg';
import txt_icon from 'src/assets/txt_icon.png';
import xls_icon from 'src/assets/xls_icon.svg';
import zip_icon from 'src/assets/zip_icon.png';

export const getFileExtension = (url: string) => url.slice(url.lastIndexOf('.'));
export const getFileLogo = (url: string) => {
  const extension = getFileExtension(url);

  switch (extension) {
    case '.ppt':
      return {
        icon: ppt_icon,
        bg: '#F8A297',
      };
    case '.pdf':
      return {
        icon: pdf_icon,
        bg: '#F8A297',
      };
    case '.txt':
      return {
        icon: txt_icon,
        bg: '#C595CD',
      };
    case '.gif':
      return {
        icon: gif_icon,
        bg: '#C595CD',
      };
    case '.doc':
      return {
        icon: doc_icon,
        bg: '#ABDEF2',
      };
    case '.mp3':
      return {
        icon: mp3_icon,
        bg: '#ABDEF2',
      };
    case '.xls':
      return {
        icon: xls_icon,
        bg: '#A7C591',
      };
    case '.zip':
      return {
        icon: zip_icon,
        bg: '#A7C591',
      };
    case '.xlsx':
      return {
        icon: xls_icon,
        bg: '#A7C591',
      };
    default:
      return {
        icon: file_icon,
        bg: '#FDECAF',
      };
  }
};

type Props = {
  file: File | string | null;
};

export default function SingleFilePreview({ file }: Props) {
  if (!file) {
    return null;
  }

  let fileUrl = '';
  let fileName = '';
  let fileLogo = '';
  let fileBg = '';
  let fileExtension = '';
  if (file) {
    if (file instanceof File) {
      fileUrl = URL.createObjectURL(file);
      fileExtension = getFileExtension(file.name);
      fileName = file.name ?? 'File';
      fileLogo = getFileLogo(fileName).icon;
      fileBg = getFileLogo(fileName).bg;
    } else {
      fileUrl = file;
      const separatedUrl = file.split('/');
      fileName = separatedUrl[separatedUrl.length - 1];
      fileExtension = getFileExtension(fileUrl);
      fileLogo = getFileLogo(fileUrl).icon;
      fileBg = getFileLogo(fileUrl).bg;
    }
  }

  const isImage = ['.png', '.svg', '.webp', '.jpg', '.jpeg'].some(
    (format) => format === fileExtension
  );

  if (isImage)
    return (
      <Image
        alt="file preview"
        src={fileUrl}
        sx={{
          width: '100%',
          maxHeight: '400px',
        }}
      />
    );
  return (
    <Stack direction="row" gap={4} padding={8} alignItems="center">
      <img src={fileLogo} width={80} />
      <Typography variant="subtitle2" flex={1}>
        {fileName}
      </Typography>
    </Stack>
  );
}
