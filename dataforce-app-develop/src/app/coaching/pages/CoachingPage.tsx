import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialTopTabScreenProps, createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { sx } from 'app/utils/sx';
import { globalStyles } from 'app/utils/globalStyles';
import { Text, useTheme } from '@vadiun/react-native-eevee';
import WeekCoaching from '../components/WeekCoaching';
import moment from 'moment';
import { CoachingNavigationType } from '../navigation';
import { HitSafeAreaView } from 'components/HitSafeAreaView';

interface CoachingPageProps extends MaterialTopTabScreenProps<CoachingNavigationType, 'coaching'> {

}

const Tab = createMaterialTopTabNavigator();

const AMOUNT_OF_WEEKS = 53;

const performanceWeeks = Array.from({ length: AMOUNT_OF_WEEKS }, (v, k) => `Week ${k + 1}`);

const CoachingPage: React.FC<CoachingPageProps> = ({ route }) => {
    const theme = useTheme();
    const week = route?.params?.week;
    return (
        <HitSafeAreaView>
            <View style={sx(globalStyles.globalPadding, { flex: 1, paddingBottom: 0 })}>
                <View style={styles.topText}>
                    <Text size="7xl" weight="bold">Recommendations</Text>
                    <Text size="xl" color="gray500">These are the recommendations made for you</Text>
                </View>
                <Tab.Navigator
                    initialRouteName={`Week ${week === undefined ? moment().utc().isoWeek() : week}`}
                    screenOptions={{
                        tabBarLabelStyle: { marginRight: 1, textTransform: 'none', fontWeight: '800' },
                        tabBarItemStyle: { width: 90 },
                        tabBarIndicatorStyle: { backgroundColor: '#4478C1' },
                        tabBarScrollEnabled: true,
                        tabBarLabel: ({ children }) => (
                            <Text style={{ fontFamily: theme.typhography.fonts.bold }}>{children}</Text>
                        ),
                        lazy: true,
                    }}>
                    {performanceWeeks.map((week, index) => (
                        <Tab.Screen key={week} name={performanceWeeks[index]} component={WeekCoaching} />
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



export default CoachingPage;