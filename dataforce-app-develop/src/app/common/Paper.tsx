import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface PaperProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

const Paper: React.FC<PaperProps> = ({ children, style }) => {
    return (
        <View style={[styles.paper, style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    paper: {
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 3,
        padding: 16,
        margin: 8,
    },
});

export default Paper;