import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import { Text } from '@vadiun/react-native-eevee';
import { HitSafeAreaView } from 'components/HitSafeAreaView';
import { globalStyles } from 'app/utils/globalStyles';
import { useAllChatGroupsQuery } from 'app/api/chatRepository';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ChatNavigationType } from '../navigation';
import ChatGroupItem from '../components/ChatGroupItem';

const ChatGroupsPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ChatNavigationType>>();
  const { data: groups, isLoading, refetch } = useAllChatGroupsQuery();

  const sortedGroups = useMemo(() => {
    if (!groups) return [];
    return [...groups].sort((a, b) => {
      const aTime = a.last_message?.created_at ?? a.created_at;
      const bTime = b.last_message?.created_at ?? b.created_at;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });
  }, [groups]);

  return (
    <HitSafeAreaView>
      <View style={[globalStyles.globalPadding, styles.header]}>
        <Text size="7xl" weight="bold">
          Chat
        </Text>
        <Text size="xl" color="gray500">
          Your group conversations
        </Text>
      </View>

      {isLoading && !groups ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4478C1" />
        </View>
      ) : sortedGroups.length === 0 ? (
        <View style={styles.center}>
          <Text size="lg" color="gray500">
            No groups available
          </Text>
        </View>
      ) : (
        <FlatList
          data={sortedGroups}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ChatGroupItem
              group={item}
              onPress={() =>
                navigation.navigate('chatConversation', {
                  groupId: item.id,
                  groupName: item.name,
                  groupMode: item.mode,
                })
              }
            />
          )}
          contentContainerStyle={{ paddingBottom: 16 }}
          onRefresh={refetch}
          refreshing={isLoading}
        />
      )}
    </HitSafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingBottom: 15,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatGroupsPage;
