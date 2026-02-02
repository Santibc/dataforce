import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Text } from '@vadiun/react-native-eevee';
import Paper from 'app/common/Paper';

interface WeekPerformanceDisplayProps {
    numberDisplay: string;
    nameDisplay: string;
}

const WeekPerformanceDisplay: React.FC<WeekPerformanceDisplayProps> = ({ nameDisplay, numberDisplay }) => {
    return (
        <View>
            <Paper style={Platform.OS === 'android' ? styles.paper : styles.paperIOS}>
                <Text style={{ color: '#006C9C', fontSize: 22 }}>{numberDisplay}</Text>
                <Text style={{ color: '#212B36', fontSize: 13 }}>{nameDisplay}</Text>
            </Paper>
        </View>
    );
};

export default WeekPerformanceDisplay;


const styles = StyleSheet.create({
    paper: {
        paddingBottom: 20,
        elevation: 5,
        margin: 0
    },
    paperIOS: {
        shadowColor: '#000',
        margin: 0,
        paddingBottom: 20,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
})