import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { HomePage } from '../pages/HomePage';

export type HomeNavigationType = {
  homeRoot: undefined;
};

const Stack = createStackNavigator<HomeNavigationType>();

export const HomeNavigation = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="homeRoot"
      options={{
        headerShown: false,
      }}
      component={HomePage}
    />
  </Stack.Navigator>
);
