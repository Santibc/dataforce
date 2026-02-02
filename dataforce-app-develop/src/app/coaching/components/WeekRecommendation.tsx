import React from 'react';
import { Dimensions, Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Button, Text } from '@vadiun/react-native-eevee';
import { Chip } from 'react-native-paper';
import Paper from 'app/common/Paper';
import RenderHtml from 'react-native-render-html';

interface WeekRecommendationProps {
    title: string;
    chipTitle: string;
    detail: string;
    content: string;
    color: string;
    onPress: () => void;
    read?: boolean;
}

export const CHIP_TITLE = {
    'congrats': 'Congratulations!',
    'coach': 'Coaching',
} as const;

export const FIELDS = {
    'fico_score': 'Fico Score',
    'seatbelt_off_rate': 'Seatbelt Off Rate',
    'speeding_event_ratio': 'Speeding Rate',
    'distraction_rate': 'Distractions Rate',
    'following_distance_rate': 'Following Distance Rate',
    'signal_violations_rate': 'Sign/Signal Violation Rate',
    'cdf': 'CDF',
    'dcr': 'DCR',
    'pod': 'POD',
    'cc': 'CC',
    'overall_tier': 'Overall Tier',
} as const;

const WeekRecommendation: React.FC<WeekRecommendationProps> = ({ chipTitle, content, detail, onPress, title, color, read = false }) => {
    const { width } = useWindowDimensions();
    const truncatedTitle = title.length > 18 ? title.slice(0, 18) + '...' : title;
    return (
        <View>
            <Paper style={Platform.OS === 'android' ? styles.paper : styles.paperIOS}>
                <View style={styles.titleContainer}>
                    <Text size="2xl" weight="bold">{truncatedTitle}</Text>
                    <View style={{ position: 'relative' }}>
                        <Chip style={{ backgroundColor: color, color: '#ffffff' }}>
                            <Text color={chipTitle === 'coach' ? 'dark900' : 'white'}>
                                {CHIP_TITLE[chipTitle as keyof typeof CHIP_TITLE]}
                            </Text>
                        </Chip>
                        <View style={read ? {} : styles.circle} />
                    </View>
                </View>
                <Text style={{ color: color, display: chipTitle === 'congrats' ? 'none' : 'flex' }}>{FIELDS[detail as keyof typeof FIELDS]}</Text>
                <RenderHtml
                    contentWidth={width}
                    source={{ html: content }}
                    systemFonts={[
                        'Poppins_300Light',
                        'Poppins_400Regular',
                        'Poppins_400Regular_Italic',
                        'Poppins_500Medium',
                        'Poppins_600SemiBold',
                        'Poppins_700Bold',
                    ]}
                    baseStyle={{ fontFamily: 'Poppins_500Medium', fontWeight: '100' }}
                    tagsStyles={{
                        h1: {
                            color: 'black',
                            fontFamily: 'Poppins_400Regular',
                            fontWeight: '100',
                        },
                        h2: {
                            color: 'black',
                            fontFamily: 'Poppins_400Regular',
                            fontWeight: '100',
                        },
                        h3: {
                            color: 'black',
                            fontFamily: 'Poppins_400Regular',
                            fontWeight: '100',
                        },
                        h4: {
                            color: 'black',
                            fontFamily: 'Poppins_400Regular',
                            fontWeight: '100',
                        },
                        h5: {
                            color: 'black',
                            fontFamily: 'Poppins_400Regular',
                            fontWeight: '100',
                        },
                        h6: {
                            color: 'black',
                            fontFamily: 'Poppins_400Regular',
                            fontWeight: '100',

                        },
                        strong: {
                            fontFamily: 'Poppins_700Bold',
                            color: 'black',
                            fontWeight: '100',
                        },
                        p: {
                            fontFamily: 'Poppins_400Regular',
                            color: '#7d8490',
                            textAlign: 'justify',
                            paddingTop: 8,
                            paddingBottom: 10,
                        },
                        i: {
                            fontFamily: 'Poppins_500Medium',
                            fontStyle: 'italic',
                            fontWeight: '400',
                        },
                        a: {
                            fontStyle: 'italic',
                            fontSize: 17,
                            fontFamily: 'Poppins_400Regular',
                        },
                        blockquote: {
                            fontFamily: 'Poppins_400Regular',
                        },
                        img: {
                            width: Dimensions.get('screen').width - 35,
                            margin: 'auto',
                        },
                        li: {
                            color: 'black',
                            fontFamily: 'Poppins_400Regular',

                        },
                    }}
                    defaultTextProps={{
                        numberOfLines: 3,
                    }}
                />
                <View style={styles.flexContainer}>
                    <Button type="outlined" onPress={onPress}>See more</Button>
                </View>
            </Paper>
        </View>
    );
};

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    circle: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 11,
        height: 11,
        borderRadius: 10,
        color: 'black',
        backgroundColor: 'red', // Change this to your desired color for the circle
        borderStyle: 'solid',
        borderColor: 'white',
        borderWidth: 1,
    },
    content: {
        paddingTop: 8,
        paddingBottom: 20,
    },
    flexContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    paper: {
        paddingBottom: 20,
        elevation: 5,
    },
    paperIOS: {
        shadowColor: '#000',
        paddingBottom: 20,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
});


export default WeekRecommendation;
