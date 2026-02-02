// FloatingMenuButtonContainer.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StyleObject, sx } from 'app/utils/sx';

interface BottomFloatingIsland {
    style?: StyleObject;
    children?: React.ReactNode;
}

const BottomFloatingIsland: React.FC<BottomFloatingIsland> = ({ style, children }) => {
    return (
        <View style={sx(styles.container, style || {})}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white', // Replace with the desired background color
        padding: 8, // Add padding as needed
        alignSelf: 'stretch', // Make the container stretch to full width
    },
});

export default BottomFloatingIsland;
