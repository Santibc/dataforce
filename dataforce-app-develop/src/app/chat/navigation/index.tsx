import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ChatGroupsPage from '../pages/ChatGroupsPage';
import ChatConversationPage from '../pages/ChatConversationPage';

export type ChatNavigationType = {
  chatGroups: undefined;
  chatConversation: {
    groupId: number;
    groupName: string;
    groupMode: 'bidirectional' | 'unilateral';
  };
};

const Stack = createStackNavigator<ChatNavigationType>();

export type ChatNavigationPropType = NavigationProp<ChatNavigationType>;

export const ChatNavigation = () => {
  const navigation = useNavigation<ChatNavigationPropType>();

  return (
    <Stack.Navigator screenOptions={{ headerStyle: { elevation: 0 } }}>
      <Stack.Screen
        name="chatGroups"
        component={ChatGroupsPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="chatConversation"
        component={ChatConversationPage}
        options={({ route }) => ({
          title: (route.params as ChatNavigationType['chatConversation']).groupName,
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: 'bold', fontFamily: 'Poppins_600SemiBold' },
          headerStyle: { elevation: 0 },
          headerLeft: () => (
            <Ionicons
              name="arrow-back"
              size={24}
              color="#242731"
              style={{ marginLeft: 15 }}
              onPress={() => navigation.navigate('chatGroups')}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};
