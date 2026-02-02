import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { globalStyles } from 'app/utils/globalStyles';
import {
    Button,
    Icon,
    Text,
    TextInput,
    VerifyAction,
    useTheme,
} from '@vadiun/react-native-eevee';
import { HitSafeAreaView } from 'components/HitSafeAreaView';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from 'app/auth/services/useAuth';
import { useDeleteUserMutation } from 'app/api/profileRepository';

interface ProfilePageProps { }

export const ProfilePage: React.FC<ProfilePageProps> = () => {
    const auth = useAuth();
    const theme = useTheme();
    const deleteUserMutation = useDeleteUserMutation();

    const [confirmation, setConfirmation] = React.useState('');
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);

    const handleConfirmationChange = (text: string) => {
        setConfirmation(text);
    };

    const deleteDisabled = confirmation.toUpperCase() !== 'DELETE';
    return (
        <HitSafeAreaView>
            <View
                style={[styles.topText, styles.container, globalStyles.globalPadding]}>
                <Text size="7xl" weight="bold">
                    Profile
                </Text>
                <Text size="xl" color="gray500">
                    These are your profile options
                </Text>
            </View>

            <View
                style={[
                    globalStyles.globalPadding,
                    styles.logoContainer,
                    { paddingBottom: 0, paddingTop: 20 },
                ]}>
                <View style={[styles.container, styles.logo]}>
                    <MaterialCommunityIcons name="account" size={60} />
                </View>
                <View>
                    <Text
                        size="5xl"
                        weight="bold">{`${auth.loggedInfo.firstname} ${auth.loggedInfo.lastname}`}</Text>
                    <Text>{`${auth.loggedInfo.email}`}</Text>
                </View>
            </View>
            <View style={[globalStyles.globalPadding, { paddingTop: 18 }]}>
                <Button
                    onPress={() => setDeleteModalOpen(true)}
                    type="outlined"
                    size="md"
                    style={{ borderColor: theme.colors.red400 }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            columnGap: 4,
                        }}>
                        <Icon
                            name="trash-outline"
                            color="red400"
                            size={19}
                            style={{ marginBottom: 2 }}
                        />
                        <Text color="red400">Delete Account</Text>
                    </View>
                </Button>
                <Button
                    onPress={() =>
                        auth.logout()
                    }
                    type="outlined"
                    size="md"
                    style={{ marginTop: 5, backgroundColor: 'white' }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            columnGap: 4,
                        }}>
                        <Icon
                            name="log-out"
                            color="dark700"
                            size={19}
                            style={{ marginBottom: 2 }}
                        />
                        <Text color="dark700">Log-out</Text>
                    </View>
                </Button>
            </View>
            <VerifyAction
                onClose={() => setDeleteModalOpen(false)}
                isVisible={deleteModalOpen}>
                <VerifyAction.Title>Delete Account</VerifyAction.Title>
                <VerifyAction.Subtitle style={{ marginBottom: 10 }}>
                    Are you sure you want to delete your account?
                </VerifyAction.Subtitle>
                <VerifyAction.Subtitle style={{ marginBottom: 10 }}>
                    Please type "DELETE" below in order to confirm.
                </VerifyAction.Subtitle>
                <View style={{ width: '100%' }}>
                    <TextInput
                        style={{
                            marginBottom: 20,
                            width: '100%',
                        }}
                        value={confirmation}
                        onChangeText={handleConfirmationChange}
                        placeholder="Type DELETE to confirm                "
                    />
                </View>
                <VerifyAction.Actions>
                    <VerifyAction.DenyButton
                        onPress={() => setDeleteModalOpen(false)}
                        disabled={deleteUserMutation.isPending}
                        style={{ width: '49%', borderColor: theme.colors.primary500 }}>
                        <Text color="primary500">Cancel</Text>
                    </VerifyAction.DenyButton>
                    <VerifyAction.AcceptButton
                        color={deleteDisabled ? 'text100' : 'primary500'}
                        disabled={deleteDisabled || deleteUserMutation.isPending}
                        onPress={() =>
                            deleteUserMutation.mutateAsync(auth.loggedInfo.id, {
                                onSuccess: () =>
                                    auth.logout()
                            })
                        }
                        style={{ width: '49%' }}>
                        <Text color={deleteDisabled ? 'dark900' : 'white'}>Confirm</Text>
                    </VerifyAction.AcceptButton>
                </VerifyAction.Actions>
            </VerifyAction>
        </HitSafeAreaView >
    );
};

const styles = StyleSheet.create({
    topText: {
        paddingBottom: 25,
    },
    logo: {
        borderRadius: 999,
        padding: 6,
    },
    logoContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 20,
        paddingBottom: 0,
        paddingTop: 20,
    },
    paper: {
        elevation: 5,
    },
    paperIOS: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    container: {
        backgroundColor: '#FFFFFF', // Background color of the container
        ...Platform.select({
            ios: {
                shadowColor: '#000000', // Shadow color
                shadowOffset: { width: 0, height: 2 }, // Shadow offset
                shadowOpacity: 0.25, // Shadow opacity
                shadowRadius: 4, // Shadow radius
            },
            android: {
                elevation: 4, // Elevation for Android
            },
        }),
    },
});
