import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon, Text } from '@vadiun/react-native-eevee';

interface ScheduleDayDataProps {
    date: string;
    time: string;
    role: {
        name: string;
        color: string;
    }
    jobsite: string;
    confirmed: boolean;
}

const ScheduleDayData: React.FC<ScheduleDayDataProps> = ({ date, jobsite, role, time, confirmed = true }) => {
    return (
        <View style={{ marginBottom: 15 }}>
            <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }}>
                <Text size="2xl" weight="bold">{date}</Text>
                {confirmed && <Icon name="checkbox" color="green500" size={20} style={{ paddingBottom: 5 }} />}
            </View>
            <View style={styles.innerContainer}>
                <Text color="gray400" size="lg">{time}</Text>
                <View style={styles.flexContainer}>
                    <Icon name="ellipse" size={10} style={{ paddingBottom: 3, paddingRight: 5, color: `${role.color}` }} />
                    <Text size="lg">{role.name}</Text>
                </View>
                <View style={styles.flexContainer}>
                    <Icon name="location" size={20} color={'green600'} style={{ marginLeft: -4.1 }} />
                    <Text color="gray400" size="lg">{jobsite}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    innerContainer: {
        padding: 2,
        paddingLeft: 13,
    },
    flexContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default ScheduleDayData;
