import React, { useEffect } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { HomeNavigation } from 'app/home/navigation';
import { useTheme } from '@vadiun/react-native-eevee';
import { PerformanceNavigation } from 'app/performance/navigation';
import { CoachingNavigation } from 'app/coaching/navigation';
import { ChatNavigation } from 'app/chat/navigation';
import { useUnreadCountsQuery } from 'app/api/chatRepository';
import * as Notifications from 'expo-notifications';
import { httpClient } from '../services/httpClient';
import { usePushNotificationNavigation } from 'app/hooks/usePushNotificationNavigation';
import { ProfilePage } from 'app/profile/ProfilePage';

export type RootNavigationType = {
  home: undefined;
  performanceRoot: undefined;
  coachingRoot: undefined;
  chatRoot: undefined;
  profileRoot: undefined;
};

const Tab = createMaterialBottomTabNavigator<RootNavigationType>();

export const MainNavigation = () => {
  const theme = useTheme();
  const { data: unreadData } = useUnreadCountsQuery();
  usePushNotificationNavigation();

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync({
      projectId: 'd38bf493-9ef1-4a19-a773-1b60d1d31192'
    })).data;
    httpClient.put('user/notification-token', { token: token });
  };

  return (
    <Tab.Navigator
      activeColor={theme.colors.primary500}
      inactiveColor={theme.colors.text300}
      barStyle={{
        backgroundColor: theme.colors.white,
      }}
      shifting={false}
    >
      <Tab.Screen
        name="home"
        component={HomeNavigation}
        options={{ tabBarIcon: 'calendar-check', tabBarLabel: 'My Schedule' }}
      />
      <Tab.Screen
        name="performanceRoot"
        component={PerformanceNavigation}
        options={{ tabBarIcon: 'chart-line-variant', tabBarLabel: 'Performance' }}
      />
      <Tab.Screen
        name="coachingRoot"
        component={CoachingNavigation}
        options={{ tabBarIcon: 'chat', tabBarLabel: 'Coaching' }}
      />
      <Tab.Screen
        name="chatRoot"
        component={ChatNavigation}
        options={{
          tabBarIcon: 'message-text-outline',
          tabBarLabel: 'Chat',
          tabBarBadge: unreadData?.total_unread ? unreadData.total_unread : undefined,
        }}
      />
      <Tab.Screen
        name="profileRoot"
        component={ProfilePage}
        options={{ tabBarIcon: 'account', tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator >
  );
};
