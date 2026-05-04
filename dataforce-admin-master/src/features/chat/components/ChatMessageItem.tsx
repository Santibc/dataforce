import { Box, Dialog, IconButton, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import Iconify from 'src/components/iconify';
import { IChatAttachment, IChatMessage } from 'src/api/chatRepository';

interface ChatMessageItemProps {
  message: IChatMessage;
  isOwn: boolean;
}

const ADMIN_ROLES = ['super_admin', 'admin', 'owner', 'manager'];

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

interface ImageBubbleProps {
  attachment: IChatAttachment;
}

function ImageBubble({ attachment }: ImageBubbleProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box
        component="img"
        src={attachment.url}
        alt={attachment.name}
        onClick={() => setOpen(true)}
        sx={{
          width: 240,
          maxWidth: '100%',
          height: 'auto',
          maxHeight: 240,
          objectFit: 'cover',
          borderRadius: 1,
          cursor: 'zoom-in',
          display: 'block',
        }}
      />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="lg"
        PaperProps={{ sx: { bgcolor: 'transparent', boxShadow: 'none' } }}
      >
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0,0,0,0.5)',
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
            }}
          >
            <Iconify icon="eva:close-fill" />
          </IconButton>
          <Box
            component="img"
            src={attachment.url}
            alt={attachment.name}
            sx={{ display: 'block', maxWidth: '90vw', maxHeight: '90vh' }}
          />
        </Box>
      </Dialog>
    </>
  );
}

interface DocumentBubbleProps {
  attachment: IChatAttachment;
  isOwn: boolean;
}

function DocumentBubble({ attachment, isOwn }: DocumentBubbleProps) {
  return (
    <Stack
      component="a"
      href={attachment.url}
      target="_blank"
      rel="noopener noreferrer"
      direction="row"
      alignItems="center"
      spacing={1.25}
      sx={{
        textDecoration: 'none',
        color: 'inherit',
        bgcolor: isOwn ? 'rgba(255,255,255,0.18)' : 'background.paper',
        px: 1.25,
        py: 1,
        borderRadius: 1,
        minWidth: 220,
        maxWidth: 320,
      }}
    >
      <Iconify
        icon={documentIconFor(attachment.mime_type)}
        width={32}
        sx={{ color: isOwn ? '#fff' : 'primary.main', flexShrink: 0 }}
      />
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography variant="body2" noWrap fontWeight={600}>
          {attachment.name}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.75 }}>
          {formatBytes(attachment.size)}
        </Typography>
      </Box>
      <Iconify
        icon="eva:external-link-outline"
        width={18}
        sx={{ opacity: 0.7, flexShrink: 0 }}
      />
    </Stack>
  );
}

export function ChatMessageItem({ message, isOwn }: ChatMessageItemProps) {
  const senderName = message.sender
    ? `${message.sender.firstname} ${message.sender.lastname}`
    : 'User';

  const isAdmin = message.sender ? ADMIN_ROLES.includes(message.sender.role) : false;
  const roleLabel = isAdmin ? 'Admin' : 'Employee';

  const time = new Date(message.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const hasBody = !!message.body && message.body.trim() !== '';
  const { attachment } = message;

  return (
    <Stack
      direction="row"
      justifyContent={isOwn ? 'flex-end' : 'flex-start'}
      sx={{ px: 2, py: 0.5 }}
    >
      <Box
        sx={{
          maxWidth: '70%',
          px: 1.25,
          py: 1,
          borderRadius: 1.5,
          bgcolor: isOwn ? 'primary.main' : 'grey.200',
          color: isOwn ? 'primary.contrastText' : 'text.primary',
        }}
      >
        {!isOwn && (
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.5, px: 0.5 }}>
            <Typography variant="caption" fontWeight="bold">
              {senderName}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                px: 0.5,
                borderRadius: 0.5,
                bgcolor: isAdmin ? 'warning.lighter' : 'info.lighter',
                color: isAdmin ? 'warning.darker' : 'info.darker',
                fontSize: 10,
              }}
            >
              {roleLabel}
            </Typography>
          </Stack>
        )}

        {attachment?.kind === 'image' && (
          <Box sx={{ mb: hasBody ? 0.75 : 0 }}>
            <ImageBubble attachment={attachment} />
          </Box>
        )}

        {attachment?.kind === 'document' && (
          <Box sx={{ mb: hasBody ? 0.75 : 0 }}>
            <DocumentBubble attachment={attachment} isOwn={isOwn} />
          </Box>
        )}

        {hasBody && (
          <Typography
            variant="body2"
            sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap', px: 0.5 }}
          >
            {message.body}
          </Typography>
        )}

        <Typography
          variant="caption"
          sx={{
            display: 'block',
            textAlign: 'right',
            mt: 0.25,
            opacity: 0.7,
            fontSize: 10,
            px: 0.5,
          }}
        >
          {time}
        </Typography>
      </Box>
    </Stack>
  );
}
