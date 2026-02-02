import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import CoachingPage from '../pages/CoachingPage';
import SeemMoreCoachingPage from '../pages/SeeMoreCoachingPage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationProp, useNavigation } from '@react-navigation/native';

export type CoachingNavigationType = {
    coaching: { week?: string; };
    seeMore: { title: string; details: string; chipTitle: string; content: string; color: string };
};

const Stack = createStackNavigator<CoachingNavigationType>();

export type AuthNavigationPropType = NavigationProp<CoachingNavigationType>;

export const CoachingNavigation = () => {
    const navigation = useNavigation<AuthNavigationPropType>();
    return (
        <Stack.Navigator screenOptions={{ headerStyle: { elevation: 0 } }}>
            <Stack.Screen
                name="coaching"
                options={{
                    headerShown: false,
                }}
                component={CoachingPage}
            />
            <Stack.Screen
                name="seeMore"
                component={SeemMoreCoachingPage}
                options={{
                    title: '',
                    headerShadowVisible: false,
                    headerTitleStyle: { fontWeight: 'bold' }, // Uppercase the 
                    headerStyle: { elevation: 0 },
                    headerLeft: () => (
                      <Ionicons
                        name="arrow-back"
                        size={24}
                        color="#242731"
                        style={{ marginLeft: 15 }}
                        onPress={() => navigation.navigate('coaching', {week: undefined})}
                      />
                    ),
                  }}
            />
        </Stack.Navigator>
    );
}
