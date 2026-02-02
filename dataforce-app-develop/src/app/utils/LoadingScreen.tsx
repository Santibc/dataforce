import React from 'react';
import { View, ActivityIndicator, StyleSheet, Image } from 'react-native';

const Logo = require('assets/logo2.png');

const LoadingScreen = () => {
    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={Logo} resizeMode="contain" />
            <ActivityIndicator size="large" color="#4478C1" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        height: 200,
        width: 200,
    },
});

export default LoadingScreen;
