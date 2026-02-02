import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import ScheduleDayData from './ScheduleDayData';
import WeekClock from './WeekClock';
import { getWeekRange, reqMomentFormatting } from 'app/utils/momentUtils';
import useClock from 'app/hooks/useClock';
import BottomFloatingIsland from './BottomFloatingIsland';
import { Button, Message, Snackbar } from '@vadiun/react-native-eevee';
import moment from 'moment';
import { useAllScheduleSemanalsQuery, useConfirmWeekUserScheduleMutation } from 'app/api/scheduleSemanalRepository';
import { useQueryClient } from '@tanstack/react-query';
import { Text } from '@vadiun/react-native-eevee';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { HomeTabsNavigationType } from '../pages/HomePage';

interface MyScheduleTabProps extends MaterialTopTabScreenProps<HomeTabsNavigationType, 'My Schedule'> {
}

const MyScheduleTab: React.FC<MyScheduleTabProps> = ({ route }) => {
    const clockTime = route?.params?.data;
    const [currentDate, navigateDays, setCurrentDate] = useClock(route?.params?.data?.from || undefined);
    const qc = useQueryClient();
    React.useEffect(() => {
        qc.removeQueries({ queryKey: ['schedulesemanal'] });
        qc.refetchQueries({ queryKey: ['schedulesemanal'] });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentDate]);
    React.useEffect(() => {
        if (clockTime?.from === undefined || clockTime.from === '') return;
        setCurrentDate(clockTime.from);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clockTime]);
    const clockTitle = getWeekRange(currentDate);
    const { data: scheduleSemanalData, isLoading } = useAllScheduleSemanalsQuery({ from: moment(currentDate).startOf('week').format(reqMomentFormatting), to: moment(currentDate).endOf('week').format(reqMomentFormatting) });
    const { mutateAsync: confirmWeek } = useConfirmWeekUserScheduleMutation();
    const isConfirmButtonAvailable = scheduleSemanalData?.some(headline => headline.confirmed === false) ?? false;
    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);

    return (
        <View style={{ paddingBottom: 10, flex: 1 }}>
            <Snackbar
                isVisible={success}
                onClose={() => setSuccess(false)}
                duration={1200}
                icon={<Message.Icon type="success" />}
            >
                <View style={{ paddingRight: 20 }}>
                    <Snackbar.Title>Success!</Snackbar.Title>
                    <Snackbar.Subtitle>Successfully confirmed current week</Snackbar.Subtitle>
                </View>
            </Snackbar>
            <Snackbar
                isVisible={error}
                onClose={() => setError(false)}
                duration={1200}
                icon={<Message.Icon type="error" />}
            >
                <View style={{ paddingRight: 20 }}>
                    <Snackbar.Title>Error</Snackbar.Title>
                    <Snackbar.Subtitle>Something went wrong, try again later</Snackbar.Subtitle>
                </View>
            </Snackbar>
            <WeekClock clockTitle={clockTitle} navigateDays={navigateDays} week={moment(currentDate).utc().isoWeek().toString()} />
            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4478C1" />
                </View>
            )}
            {scheduleSemanalData !== undefined && scheduleSemanalData.length === 0 && (
                <View style={styles.flexContainer}>
                    <Text style={styles.centeredText}>No shifts found for this week</Text>
                </View>
            )}
            <ScrollView showsVerticalScrollIndicator={false}>
                {scheduleSemanalData &&
                    scheduleSemanalData.map((headline) => (
                        <ScheduleDayData
                            key={headline.id}
                            date={moment(headline.from).format('dddd DD')}
                            jobsite={headline.jobsite.name}
                            role={{ color: headline.color, name: headline.name }}
                            time={`${moment(headline.from).format('h:mm A')} - ${moment(headline.to).format('h:mm A')}`}
                            confirmed={headline.confirmed}
                        />
                    ))}
            </ScrollView>
            <BottomFloatingIsland >
                <Button type={isConfirmButtonAvailable ? "contained" : "outlined"} style={[{ alignSelf: 'flex-end' }, isConfirmButtonAvailable ? {} : styles.saveButton]} onPress={async () => {
                    try {
                        await confirmWeek({ from: moment(currentDate).startOf('week').format(reqMomentFormatting), to: moment(currentDate).endOf('week').format(reqMomentFormatting) });
                        setSuccess(true);
                    } catch (error) {
                        setError(true);
                    }
                }} disabled={!isConfirmButtonAvailable}>Confirm Week</Button>
            </BottomFloatingIsland>
        </View >
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 6,
        justifyContent: 'center',
        alignItems: 'center',
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
    saveButton: {
        backgroundColor: '#dfe3e8',
    },
});


export default MyScheduleTab;
