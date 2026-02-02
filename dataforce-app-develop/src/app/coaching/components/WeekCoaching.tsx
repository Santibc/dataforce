import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import WeekRecommendation from './WeekRecommendation';
import { StackScreenProps } from '@react-navigation/stack';
import { useIsFocused } from '@react-navigation/native';
import {
    useAllCoachingWeeksQuery,
    useSeeMoreReadMutation,
} from 'app/api/coachingRepository';
import moment from 'moment';
import { Text } from '@vadiun/react-native-eevee';

interface WeekCoachingProps extends StackScreenProps<any, any> {
}

const COLORS_WEEK_COACHING = {
    coach: '#ffab00',
    congrats: '#36b37e',
} as const;

const WeekCoaching: React.FC<WeekCoachingProps> = ({ navigation, route }) => {
    const isFocused = useIsFocused();
    const { data, isLoading } = useAllCoachingWeeksQuery({
        week: Number(route.name.split(' ')[1]),
        year: Number(moment().utc().year()),
        enabled: isFocused,
    });
    const { mutateAsync: seeMore } = useSeeMoreReadMutation();

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4478C1" />
            </View>
        );
    }
    return (
        <View style={styles.weekRecommendation}>
            {data !== undefined && data.length === 0 && (
                <View style={styles.flexContainer}>
                    <Text style={styles.centeredText}>No messages found this week</Text>
                </View>
            )}
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}>
                {data &&
                    data.map((week, index) => (
                        <WeekRecommendation
                            key={index}
                            read={week.read}
                            title={week.subject}
                            chipTitle={week.type}
                            detail={week.category}
                            content={week.content}
                            color={
                                COLORS_WEEK_COACHING[
                                week.type as keyof typeof COLORS_WEEK_COACHING
                                ]
                            }
                            onPress={() => {
                                seeMore(week.id);
                                navigation.push('seeMore', {
                                    title: week.subject,
                                    chipTitle: week.type,
                                    content: week.content,
                                    color:
                                        COLORS_WEEK_COACHING[
                                        week.type as keyof typeof COLORS_WEEK_COACHING
                                        ],
                                    details: week.category,
                                });
                            }}
                        />
                    ))}
                <View style={{ paddingBottom: 40 }} />
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
        flex: 6,
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
    scrollView: {
        paddingTop: 25,
        paddingBottom: 25,
    },
});

export default WeekCoaching;
