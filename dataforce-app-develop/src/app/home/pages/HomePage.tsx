import { globalStyles } from 'app/utils/globalStyles';
import { sx } from 'app/utils/sx';
import React from 'react';
import { View } from 'react-native';
import { Text, useTheme } from '@vadiun/react-native-eevee';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MyScheduleTab from '../components/MyScheduleTab';
import MyPreferencesTab from '../components/MyPreferencesTab';
import { HitSafeAreaView } from 'components/HitSafeAreaView';

export type HomeTabsNavigationType = {
  'My Schedule': { data: { from: string; position: string; type: string; } };
  'My preferences': { data: string };
}

const Tab = createMaterialTopTabNavigator<HomeTabsNavigationType>();

export const HomePage = () => {
  const theme = useTheme();
  return (
    <HitSafeAreaView>
      <View style={sx(globalStyles.globalPadding, { flex: 1, paddingBottom: 0 })}>
        <Text size="7xl" weight="bold">Work schedule</Text>
        <Tab.Navigator
          screenOptions={{
            tabBarLabelStyle: { marginRight: 1, textTransform: 'none', fontWeight: '900', fontSize: theme.typhography.fontSizes.lg, fontFamily: theme.typhography.fonts.thin },
            tabBarItemStyle: { width: 125 },
            tabBarIndicatorStyle: { backgroundColor: '#4478C1' },
            tabBarLabel: ({ children }) => (
              <Text style={{ fontFamily: theme.typhography.fonts.bold }}>{children}</Text>
            ),
          }}>
          <Tab.Screen name="My Schedule" component={MyScheduleTab} />
          <Tab.Screen name="My preferences" component={MyPreferencesTab} />
        </Tab.Navigator>
      </View>
    </HitSafeAreaView>
  );
};
