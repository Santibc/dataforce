import React, { useEffect, useLayoutEffect, useRef } from 'react';
import styled from 'styled-components/native';
import { Dimensions, StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { Text, TextProps } from '@vadiun/react-native-eevee';
import Modal, { ModalProps } from 'react-native-modal';

export interface SnackbarProps extends Partial<ModalProps> {
    onClose?: () => void;
    onDurationFinish?: () => void;
    duration?: number;
    isVisible: boolean;
    icon?: React.ReactNode;
}

/**
 * Snackbar.
 * It displays a amall bottom message. Use the Message for a full screen message.
 * @extends [react-native-modal]{@link (https://github.com/react-native-modal/react-native-modal)}
 * @param isVisible If true the modall will be visible
 * @param onClose If the duration is provided this will be called after that duration every time isVisible changes to true, otherwise this will be called after the backdrop isPressed or the back button is pressed. For a more granular control check the onBackButtonPress and onBackdropPress props from [react-native-modal]{@link (https://github.com/react-native-modal/react-native-modal)} and the onDurationFinish callback.
 * @param duration Duration in ms after which the onClose method will be called. Defaults to Infinity.
 * @param onDurationFinish Callback that will be called after the duration. Only required if the onClose default behaviour is not usefull.
 * @param icon Snackbar icon. Snackbar.Icon is ment to be used here.
 * @example
 * const [isVisible, setIsVisible] = useState(true);
 * return (
 *    <Snackbar
 *      isVisible={isVisible}
 *      onClose={() => setIsVisible(false)}
 *      duration={3000}
 *      icon={<Message.Icon type="success"/>}
 *    >
 *      <Snackbar.Title>Exito!</Message.Title>
 *      <Snackbar.Subtitle>Evve es el mejor template del universo</Snackbar.Subtitle>
 *    </Message>
 * );
 */
export const Snackbar = ({
    children,
    duration = Infinity,
    icon,
    ...props
}: SnackbarProps) => {
    const onCloseRef = useRef<(() => void) | undefined>(props.onClose);
    const onDurationFinishRef = useRef<(() => void) | undefined>(
        props.onDurationFinish
    );
    useLayoutEffect(() => {
        onCloseRef.current = props.onClose;
        onDurationFinishRef.current = props.onDurationFinish;
    });

    useEffect(() => {
        // Auto hide if duration is provided
        let timeout: any | undefined;
        if (duration !== Infinity && props.isVisible && onCloseRef.current) {
            timeout = setTimeout(() => {
                onCloseRef.current && onCloseRef.current();
                onDurationFinishRef.current && onDurationFinishRef.current();
            }, duration);
        }
        return () => timeout && clearTimeout(timeout);
    }, [props.isVisible, duration]);

    return (
        <Modal
            {...props}
            style={[{ margin: 0, justifyContent: 'flex-start' }, props.style]}
            backdropTransitionOutTiming={0}
            onBackButtonPress={() => {
                props.onBackButtonPress && props.onBackButtonPress();
                props.onClose && duration === Infinity && props.onClose();
            }}
            animationIn={'fadeInDown'}
            onBackdropPress={() => {
                props.onBackdropPress && props.onBackdropPress();
                props.onClose && duration === Infinity && props.onClose();
            }}
        >
            <View style={styles.container}>
                {icon}
                <View>{children}</View>
            </View>
        </Modal>
    );
};

Snackbar.Icon = ({
    type,
}: {
    type: 'error' | 'success' | 'info' | 'warning';
}) => {
    const icons = {
        success: (
            <LottieView
                source={require('../../../assets/success.json')}
                autoPlay
                loop={false}
            />
        ),
        error: (
            <LottieView
                source={require('../../../assets/error.json')}
                autoPlay
                loop={false}
            />
        ),
        info: <LottieView source={require('../../../assets/info.json')} autoPlay loop />,
        warning: (
            <LottieView
                source={require('../../../assets/warning.json')}
                autoPlay
                loop={false}
            />
        ),
    };
    return <IconContainer>{icons[type]}</IconContainer>;
};

Snackbar.Title = (props: TextProps) => (
    <Title size="lg" weight="bold" {...props} />
);

Snackbar.Subtitle = (props: TextProps) => (
    <Subtitle color="text400" size="sm" {...props} />
);

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        justifyContent: 'center',
        width: Dimensions.get('window').width - 40,
        padding: 40,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 40,
        paddingRight: 40,
        borderRadius: 20,
        margin: 20,
        marginBottom: 'auto',
        marginTop: 10,
    },
});

const Title = styled((props: React.JSX.IntrinsicAttributes & TextProps) => <Text {...props} />)`
  text-align: center;
  margin-bottom: 10px;
`;

const Subtitle = styled((props: React.JSX.IntrinsicAttributes & TextProps) => <Text {...props} />)`
  text-align: center;
`;

const IconContainer = styled.View`
  height: 50px;
  width: 50px;
  margin-right: 15px;
`;