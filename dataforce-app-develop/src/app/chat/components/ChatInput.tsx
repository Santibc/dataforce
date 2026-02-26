import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text, useTheme } from '@vadiun/react-native-eevee';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface ChatInputProps {
  onSend: (body: string) => void;
  disabled?: boolean;
  loading?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled = false,
  loading = false,
}) => {
  const theme = useTheme();
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    onSend(trimmed);
    setText('');
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
    <View style={[styles.container, { borderTopColor: '#E0E0E0' }]}>
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
        disabled={!text.trim() || loading}
        style={[
          styles.sendButton,
          {
            backgroundColor:
              text.trim() && !loading
                ? theme.colors.primary500
                : '#E0E0E0',
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
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    backgroundColor: '#fff',
  },
  disabledContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    backgroundColor: '#FAFAFA',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
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
});

export default ChatInput;
