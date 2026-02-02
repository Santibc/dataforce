import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import PerformancePage from '../pages/PerformancePage';

export type PerformanceNavigationType = {
    performance: undefined;
};

const Stack = createStackNavigator<PerformanceNavigationType>();

export const PerformanceNavigation = () => (
    <Stack.Navigator>
        <Stack.Screen
            name="performance"
            options={{
                headerShown: false,
            }}
            component={PerformancePage}
        />
    </Stack.Navigator>
);
