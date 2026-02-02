import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { sx } from 'app/utils/sx';
import { globalStyles } from 'app/utils/globalStyles';
import { Text, useTheme } from '@vadiun/react-native-eevee';
import WeekPerfomance from '../components/WeekPerformance';
import moment from 'moment';
import { HitSafeAreaView } from 'components/HitSafeAreaView';

interface PerformancePageProps {

}

const Tab = createMaterialTopTabNavigator();

const AMOUNT_OF_WEEKS = 53;

const performanceWeeks = Array.from({ length: AMOUNT_OF_WEEKS }, (v, k) => `Week ${k + 1}`);

const PerformancePage: React.FC<PerformancePageProps> = ({ }) => {
    const theme = useTheme();
    return (
        <HitSafeAreaView>
            <View style={sx(globalStyles.globalPadding, { flex: 1 })}>
                <View style={styles.topText}>
                    <Text size="7xl" weight="bold">My performance</Text>
                    <Text size="xl" color="gray500">These are your metrics from the last week</Text>
                </View>
                <Tab.Navigator
                    initialRouteName={`Week ${moment().utc().isoWeek()}`}
                    screenOptions={{
                        tabBarLabelStyle: { marginRight: 1, textTransform: 'none', fontWeight: '800', fontFamily: theme.typhography.fonts.bold },
                        tabBarItemStyle: { width: 90 },
                        tabBarIndicatorStyle: { backgroundColor: '#4478C1' },
                        tabBarScrollEnabled: true,
                        tabBarLabel: ({ children }) => (
                            <Text style={{ fontFamily: theme.typhography.fonts.bold }}>{children}</Text>
                        ),
                        lazy: true,
                    }}
                >
                    {performanceWeeks.map((week, index) => (
                        // @ts-expect-error
                        <Tab.Screen key={week} name={performanceWeeks[index]} component={WeekPerfomance} />
                    ))}
                </Tab.Navigator>
            </View>
        </HitSafeAreaView>
    );
};


const styles = StyleSheet.create({
    topText: {
        paddingBottom: 25,
    },
});



export default PerformancePage;
