import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { HomeNavigationType } from 'app/home/navigation';

const NOTIFICATIONS = {
    SHIFTS: {
        PUBLISHED_SHIFT: 'published_shift',
        UPDATED_SHIFT: 'updated_shift',
        DELETED_SHIFT: 'deleted_shift',
    } as const,
    COACHING: {
        CONGRATS: 'congrats',
        COACH: 'coaching',
    } as const,
} as const;

type ShiftNotificationType =
    | (typeof NOTIFICATIONS.SHIFTS)[keyof typeof NOTIFICATIONS.SHIFTS]
    | (typeof NOTIFICATIONS.COACHING)[keyof typeof NOTIFICATIONS.COACHING];

export const usePushNotificationNavigation = () => {
    const navigation = useNavigation<NavigationProp<HomeNavigationType>>();

    useEffect(() => {
        const handleNavigation = (response: Notifications.NotificationResponse) => {
            const data = response.notification.request.content.data;

            // Check the notification type
            const notificationType = data.type as ShiftNotificationType;

            // Handle different types of notifications
            switch (notificationType) {
                case 'published_shift':
                    handleAppointmentNotification(data);
                    break;
                case 'updated_shift':
                    handleAppointmentNotification(data);
                    break;
                case 'deleted_shift':
                    handleAppointmentNotification(data);
                    break;
                case 'congrats':
                    handleCoachingNotification(data);
                    break;
                case 'coaching':
                    handleCoachingNotification(data);
                    break;
                // Add more cases for other notification types as needed
                default:
                    // Handle default case
                    break;
            }
        };

        const handleAppointmentNotification = (data: any) => {
            // @ts-expect-error
            navigation.navigate('homeRoot', {
                screen: 'My Schedule',
                params: { data: data },
            });
        };

        const handleCoachingNotification = (data: any) => {
            // @ts-expect-error
            navigation.navigate('coaching', {
                screen: `Week ${data.week}`,
                params: { ...data },
            });
        };

        // Catch notification when the user taps the notification and the app is killed
        Notifications.getLastNotificationResponseAsync().then(response => {
            if (
                response?.actionIdentifier ===
                Notifications.DEFAULT_ACTION_IDENTIFIER &&
                response !== null
            ) {
                handleNavigation(response);
            }
        });

        // Catch all notifications when the app is background or foreground
        const subscription =
            Notifications.addNotificationResponseReceivedListener(handleNavigation);

        return () => subscription.remove();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};
