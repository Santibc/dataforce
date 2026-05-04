import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text, useTheme } from '@vadiun/react-native-eevee';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { IAttachmentInput } from 'app/api/chatRepository';
import { pickDocument, pickImage } from '../utils/pickAttachment';

interface ChatInputProps {
  onSend: (payload: {
    body?: string;
    attachment?: IAttachmentInput | null;
  }) => void;
  disabled?: boolean;
  loading?: boolean;
}

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

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled = false,
  loading = false,
}) => {
  const theme = useTheme();
  const [text, setText] = useState('');
  const [attachment, setAttachment] = useState<IAttachmentInput | null>(null);

  const isImageAttachment = attachment?.mime_type.startsWith('image/');
  const canSend = (!!text.trim() || !!attachment) && !loading;

  const handleSend = () => {
    if (!canSend) return;
    onSend({
      body: text.trim() || undefined,
      attachment: attachment ?? undefined,
    });
    setText('');
    setAttachment(null);
  };

  const openPicker = async (kind: 'image' | 'document') => {
    try {
      const result =
        kind === 'image' ? await pickImage() : await pickDocument();
      if (result) setAttachment(result);
    } catch (e) {
      Alert.alert('Error', 'No se pudo abrir el selector de archivos.');
    }
  };

  const onAttachPress = () => {
    if (loading) return;
    Alert.alert(
      'Adjuntar archivo',
      'Selecciona el tipo de archivo a adjuntar',
      [
        { text: 'Foto / Imagen', onPress: () => openPicker('image') },
        { text: 'Documento', onPress: () => openPicker('document') },
        { text: 'Cancelar', style: 'cancel' },
      ],
      { cancelable: true },
    );
  };

  if (disabled) {
    return (
      <View style={[styles.disabledContainer, { borderTopColor: '#E0E0E0' }]}>
        <MaterialCommunityIcons name="lock-outline" size={18} color="#999" />
        <Text size="sm" color="gray500" style={{ marginLeft: 8, flex: 1 }}>
          Only administrators can send messages in this group
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, { borderTopColor: '#E0E0E0' }]}>
      {attachment && (
        <View style={styles.previewContainer}>
          {isImageAttachment ? (
            <Image
              source={{ uri: attachment.uri }}
              style={styles.previewImage}
            />
          ) : (
            <View style={styles.previewDoc}>
              <MaterialCommunityIcons
                name={documentIconFor(attachment.mime_type)}
                size={28}
                color={theme.colors.primary500}
              />
              <View style={styles.previewDocText}>
                <Text size="sm" numberOfLines={1} style={styles.previewName}>
                  {attachment.name}
                </Text>
                {!!attachment.size && (
                  <Text size="sm" color="gray500" style={{ fontSize: 11 }}>
                    {formatBytes(attachment.size)}
                  </Text>
                )}
              </View>
            </View>
          )}
          <TouchableOpacity
            onPress={() => setAttachment(null)}
            style={styles.removeBtn}
            disabled={loading}
          >
            <MaterialCommunityIcons name="close" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.inputRow}>
        <TouchableOpacity
          onPress={onAttachPress}
          disabled={loading}
          style={styles.attachButton}
        >
          <MaterialCommunityIcons
            name="paperclip"
            size={22}
            color={loading ? '#BDBDBD' : '#666'}
          />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          value={text}
          onChangeText={setText}
          multiline
          maxLength={5000}
          editable={!loading}
        />

        <TouchableOpacity
          onPress={handleSend}
          disabled={!canSend}
          style={[
            styles.sendButton,
            {
              backgroundColor: canSend ? theme.colors.primary500 : '#E0E0E0',
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <MaterialCommunityIcons name="send" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: 1,
    backgroundColor: '#fff',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  disabledContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    backgroundColor: '#FAFAFA',
  },
  attachButton: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    maxHeight: 100,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 4,
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#EEE',
  },
  previewDoc: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  previewDocText: {
    flex: 1,
    marginLeft: 8,
  },
  previewName: {
    fontSize: 13,
  },
  removeBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

export default ChatInput;
