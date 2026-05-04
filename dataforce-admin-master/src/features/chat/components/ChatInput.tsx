import {
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useRef, useState } from 'react';
import Iconify from 'src/components/iconify';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

const MAX_SIZE_BYTES = 10 * 1024 * 1024;

const formatBytes = (bytes?: number) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const documentIconFor = (mime: string): string => {
  if (mime === 'application/pdf') return 'eva:file-text-outline';
  if (mime.includes('word')) return 'eva:file-text-outline';
  if (mime.includes('excel') || mime.includes('spreadsheet')) return 'eva:file-text-outline';
  return 'eva:file-outline';
};

interface ChatInputProps {
  onSend: (payload: { body?: string; attachment?: File | null }) => void;
  disabled?: boolean;
  loading?: boolean;
}

export function ChatInput({ onSend, disabled = false, loading = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isImageAttachment = !!attachment && attachment.type.startsWith('image/');
  const canSend = (!!message.trim() || !!attachment) && !loading;

  const clearAttachment = () => {
    setAttachment(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = () => {
    if (!canSend) return;
    onSend({
      body: message.trim() || undefined,
      attachment: attachment ?? undefined,
    });
    setMessage('');
    clearAttachment();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const onAttachClick = () => {
    if (loading) return;
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      // eslint-disable-next-line no-alert
      alert('Formato no permitido. Solo se admiten imágenes (JPG/PNG/WEBP), PDF, Word y Excel.');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      // eslint-disable-next-line no-alert
      alert('El tamaño máximo permitido por adjunto es 10 MB.');
      e.target.value = '';
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setAttachment(file);
    setPreviewUrl(file.type.startsWith('image/') ? URL.createObjectURL(file) : null);
  };

  if (disabled) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          px: 2,
          py: 1.5,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'action.disabledBackground',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="eva:lock-outline" width={16} sx={{ color: 'text.disabled' }} />
          <Typography variant="body2" color="text.disabled">
            Only administrators can send messages in this group
          </Typography>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
      {attachment && (
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ px: 2, pt: 1.5, pb: 0.5 }}
        >
          {isImageAttachment && previewUrl ? (
            <Box
              component="img"
              src={previewUrl}
              alt={attachment.name}
              sx={{
                width: 56,
                height: 56,
                objectFit: 'cover',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
              }}
            />
          ) : (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                flexGrow: 1,
                px: 1.5,
                py: 1,
                bgcolor: 'grey.100',
                borderRadius: 1,
                minWidth: 0,
              }}
            >
              <Iconify
                icon={documentIconFor(attachment.type)}
                width={28}
                sx={{ color: 'primary.main' }}
              />
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="body2" noWrap fontWeight={600}>
                  {attachment.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatBytes(attachment.size)}
                </Typography>
              </Box>
            </Stack>
          )}
          <IconButton
            size="small"
            onClick={clearAttachment}
            disabled={loading}
            sx={{ bgcolor: 'grey.300', '&:hover': { bgcolor: 'grey.400' } }}
          >
            <Iconify icon="eva:close-fill" width={16} />
          </IconButton>
        </Stack>
      )}

      <Stack
        direction="row"
        alignItems="flex-end"
        spacing={1}
        sx={{ px: 2, py: 1.5 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_MIME_TYPES.join(',')}
          style={{ display: 'none' }}
          onChange={onFileChange}
        />
        <IconButton
          onClick={onAttachClick}
          disabled={loading}
          size="small"
          title="Attach file"
          sx={{ mb: 0.25 }}
        >
          <Iconify icon="eva:attach-2-outline" />
        </IconButton>

        <TextField
          fullWidth
          multiline
          maxRows={5}
          size="small"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  color="primary"
                  onClick={handleSend}
                  disabled={!canSend}
                  size="small"
                >
                  <Iconify icon="eva:paper-plane-fill" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </Stack>
  );
}
