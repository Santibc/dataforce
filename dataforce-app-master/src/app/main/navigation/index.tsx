import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {HomeNavigation} from 'app/home/navigation';
import {useTheme} from '@vadiun/react-native-eevee';

export type RootNavigationType = {
  home: undefined;
  more: undefined;
};

const Tab = createMaterialBottomTabNavigator<RootNavigationType>();

export const MainNavigation = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      activeColor={theme.colors.primary500}
      inactiveColor={theme.colors.text300}
      labeled={false}
      shifting
      barStyle={{
        backgroundColor: theme.colors.white,
      }}>
      <Tab.Screen
        name="home"
        component={HomeNavigation}
        options={{tabBarIcon: 'home-outline'}}
      />
      <Tab.Screen
        name="more"
        component={HomeNavigation}
        options={{tabBarIcon: 'dots-horizontal'}}
      />
    </Tab.Navigator>
  );
};
