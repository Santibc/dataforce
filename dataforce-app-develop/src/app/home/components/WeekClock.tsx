import React from 'react';
import { Platform, View } from 'react-native';
import { Icon, Text } from '@vadiun/react-native-eevee';

interface WeekClockProps {
    navigateDays: (days: number) => void;
    clockTitle: string;
    week: string;
}

const WeekClock: React.FC<WeekClockProps> = ({ clockTitle, navigateDays, week }) => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Icon name="chevron-back" color={'gray400'} size={25} onPress={() => navigateDays(-7)} />
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 0 }}>
                <Text size="5xl" weight="bold" style={{ paddingHorizontal: 12, paddingVertical: 0 }}>{clockTitle}</Text>
                <Text size="xl" weight="bold" style={{ marginTop: Platform.OS === 'ios' ? -3 : -10, color: '#637381' }}>WEEK {week}</Text>
            </View>
            <Icon name="chevron-forward" color={'gray400'} size={25} onPress={() => navigateDays(7)} />
        </View>
    );
};

export default WeekClock;
