import React, { useEffect, useRef } from 'react';
import { Image, StyleSheet, Dimensions, Animated } from 'react-native';

// Import your splash screen image
// @ts-ignore
import SplashScreenImage from '../../../assets/logo2.png';

export const SplashScreen = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 1,
                duration: 1000, // Adjust the duration as needed
                useNativeDriver: true,
            }
        ).start();
    }, [fadeAnim]);

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <Image source={SplashScreenImage} style={styles.image} resizeMode="contain" />
        </Animated.View>
    );
};

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF', // Set your desired background color
    },
    image: {
        width: width * 0.8, // Adjust the width as needed
        height: height * 0.8, // Adjust the height as needed
    },
});

