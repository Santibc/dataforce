import * as Notifications from 'expo-notifications';
import React from 'react';

export const useDisplayPushNotificationOnForeground = () => {
    React.useEffect(() => {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: false,
                shouldSetBadge: false,
            }),
        });
    }, []);
};