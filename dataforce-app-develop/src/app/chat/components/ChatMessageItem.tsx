import React, { useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Text, useTheme } from '@vadiun/react-native-eevee';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { IChatAttachment, IChatMessage } from 'app/api/chatRepository';

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
  if (mime === 'application/pdf') return 'file-pdf-box';
  if (mime.includes('word')) return 'file-word';
  if (mime.includes('excel') || mime.includes('spreadsheet')) return 'file-excel';
  return 'file-document-outline';
};

const openDocument = async (url: string) => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('No se pudo abrir', 'El archivo no se puede abrir desde aquí.');
    }
  } catch {
    Alert.alert('Error', 'No se pudo abrir el archivo.');
  }
};

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  isOwn,
}) => {
  const theme = useTheme();
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);

  const senderName = message.sender
    ? `${message.sender.firstname} ${message.sender.lastname}`
    : 'User';

  const isAdmin = message.sender
    ? ADMIN_ROLES.includes(message.sender.role)
    : false;
  const roleLabel = isAdmin ? 'Admin' : 'Employee';

  const time = new Date(message.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const hasBody = !!message.body && message.body.trim() !== '';
  const attachment: IChatAttachment | null = message.attachment;

  return (
    <View
      style={[
        styles.container,
        isOwn ? styles.containerOwn : styles.containerOther,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isOwn
            ? { backgroundColor: theme.colors.primary500 }
            : styles.bubbleOther,
        ]}
      >
        {!isOwn && (
          <View style={styles.senderRow}>
            <Text size="sm" weight="bold">
              {senderName}
            </Text>
            <View
              style={[
                styles.roleBadge,
                {
                  backgroundColor: isAdmin ? '#FFF8E1' : '#E3F2FD',
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 9,
                  color: isAdmin ? '#F57F17' : '#1565C0',
                  fontWeight: '600',
                }}
              >
                {roleLabel}
              </Text>
            </View>
          </View>
        )}

        {attachment?.kind === 'image' && (
          <TouchableOpacity
            onPress={() => setImagePreviewVisible(true)}
            activeOpacity={0.85}
            style={[styles.imageWrapper, hasBody && { marginBottom: 6 }]}
          >
            <Image
              source={{ uri: attachment.url }}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}

        {attachment?.kind === 'document' && (
          <TouchableOpacity
            onPress={() => openDocument(attachment.url)}
            activeOpacity={0.7}
            style={[
              styles.docCard,
              isOwn ? styles.docCardOwn : styles.docCardOther,
              hasBody && { marginBottom: 6 },
            ]}
          >
            <MaterialCommunityIcons
              name={documentIconFor(attachment.mime_type)}
              size={32}
              color={isOwn ? '#fff' : theme.colors.primary500}
            />
            <View style={styles.docInfo}>
              <Text
                size="sm"
                numberOfLines={1}
                style={[styles.docName, isOwn && { color: '#fff' }]}
              >
                {attachment.name}
              </Text>
              <Text
                size="sm"
                style={{
                  fontSize: 11,
                  color: isOwn ? 'rgba(255,255,255,0.75)' : '#777',
                }}
              >
                {formatBytes(attachment.size)}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {hasBody && (
          <Text size="md" style={[styles.body, isOwn ? { color: '#fff' } : {}]}>
            {message.body}
          </Text>
        )}

        <Text
          size="sm"
          style={[
            styles.time,
            isOwn ? { color: 'rgba(255,255,255,0.7)' } : { color: '#999' },
          ]}
        >
          {time}
        </Text>
      </View>

      {attachment?.kind === 'image' && (
        <Modal
          visible={imagePreviewVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setImagePreviewVisible(false)}
        >
          <TouchableWithoutFeedback
            onPress={() => setImagePreviewVisible(false)}
          >
            <View style={styles.modalBackdrop}>
              <Image
                source={{ uri: attachment.url }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  containerOwn: {
    alignItems: 'flex-end',
  },
  containerOther: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 12,
  },
  bubbleOther: {
    backgroundColor: '#F0F0F0',
  },
  senderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  roleBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  imageWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 8,
    backgroundColor: '#DDD',
  },
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 200,
  },
  docCardOwn: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  docCardOther: {
    backgroundColor: '#FFFFFF',
  },
  docInfo: {
    flex: 1,
    marginLeft: 10,
  },
  docName: {
    fontSize: 13,
    fontWeight: '600',
  },
  body: {
    lineHeight: 20,
    paddingHorizontal: 4,
  },
  time: {
    textAlign: 'right',
    marginTop: 2,
    fontSize: 10,
    paddingHorizontal: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalImage: {
    width: '95%',
    height: '85%',
  },
});

export default ChatMessageItem;
