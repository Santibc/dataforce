import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import WeekPerformanceDisplay from './WeekPerformanceDisplay';
import { PerformanceNavigationType } from '../navigation';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { useAllWeekPerformancesQuery } from 'app/api/weekPerformanceRepository';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
import { Text } from '@vadiun/react-native-eevee';
import { FIELDS } from 'app/coaching/components/WeekRecommendation';
import { useAuth } from 'app/auth/services/useAuth';

interface WeekPerfomanceProps extends MaterialTopTabScreenProps<PerformanceNavigationType, 'performance'> {

}

const WeekPerfomance: React.FC<WeekPerfomanceProps> = ({ route }) => {
    const isFocused = useIsFocused();
    const user = useAuth();
    const { data, isLoading } = useAllWeekPerformancesQuery({ user_id: user.loggedInfo.id, week: Number(route.name.split(' ')[1]), year: Number(moment().utc().year()), enabled: isFocused });
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4478C1" />
            </View>
        );
    }

    return (
        <View style={styles.weekRecommendation}>
            {data === undefined || data.length === 0 && (
                <View style={styles.flexContainer}>
                    <Text style={styles.centeredText}>No data found this week</Text>
                </View>
            )}
            <ScrollView contentContainerStyle={styles.container}>
                {data && data.length > 0 && Object.entries(data[0]).map(([key, value], index) => {
                    if (key === 'id') return;
                    return (
                        <View key={index} style={styles.column}>
                            <WeekPerformanceDisplay numberDisplay={value} nameDisplay={FIELDS[key as keyof typeof FIELDS]} />
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    weekRecommendation: {
        paddingTop: 0,
        flex: 6,
    },
    container: {
        flexDirection: 'row', // Set flexDirection to 'row' for horizontal arrangement
        flexWrap: 'wrap', // Allow items to wrap to the next row
        paddingTop: 25,
    },
    column: {
        width: '50%', // Set width to 50% for two columns
        padding: 8, // Adjust padding as needed
    },
    flexContainer: {
        flex: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredText: {
        textAlign: 'center',
        fontSize: 16,
    },
});

export default WeekPerfomance;
