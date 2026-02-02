import React from 'react';
import { Dimensions, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Chip, Text } from '@vadiun/react-native-eevee';
import { CoachingNavigationType } from '../navigation';
import { StackScreenProps } from '@react-navigation/stack';
import { globalStyles } from 'app/utils/globalStyles';
import RenderHtml from 'react-native-render-html';
import { CHIP_TITLE, FIELDS } from '../components/WeekRecommendation';

interface SeemMoreCoachingPageProps extends StackScreenProps<CoachingNavigationType, 'seeMore'> {

}

const SeemMoreCoachingPage: React.FC<SeemMoreCoachingPageProps> = ({ route, navigation }) => {
    const params = route.params;
    const { width } = useWindowDimensions();

    React.useEffect(() => {
        navigation.setOptions({
            title: params.title,
            headerTitleStyle: {
                fontFamily: 'Poppins_700Bold',
            }
        });
    }, [navigation, params.title]);

    return (
        <View style={globalStyles.globalPadding}>
            <View style={styles.titleContainer}>
                <Text size="2xl" weight="bold" style={{ color: params.color, opacity: params.chipTitle === 'congrats' ? 0 : 1 }}>{FIELDS[params.details as keyof typeof FIELDS]}</Text>
                <Chip style={{ backgroundColor: params.color }}>
                    <Text color={params.chipTitle === 'coach' ? 'dark900' : 'white'}>
                        {CHIP_TITLE[params.chipTitle as keyof typeof CHIP_TITLE]}
                    </Text>
                </Chip>
            </View>
            <RenderHtml
                contentWidth={width}
                source={{ html: params.content }}
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
            />
        </View>
    );
};

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 25,
    },
});


export default SeemMoreCoachingPage;
