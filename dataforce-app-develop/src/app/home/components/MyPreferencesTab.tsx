import {useQueryClient} from '@tanstack/react-query';
import {
  Button,
  Checkbox,
  Message,
  Snackbar,
  Text,
} from '@vadiun/react-native-eevee';
import {
  IRecievedUserPreferences,
  IUpdateUserPreferences,
  useAllUserPreferencesQuery,
  useRepeatPreviousWeekUserPreferencesMutation,
  useUpdateUserPreferencesMutation,
} from 'app/api/userPreferencesRepository';
import useClock from 'app/hooks/useClock';
import {
  getWeekRange,
  replaceExistingDays,
  reqMomentFormatting,
} from 'app/utils/momentUtils';
import {sx} from 'app/utils/sx';
import {ErrorMessage, Field, FieldArray, Formik} from 'formik';
import moment from 'moment';
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import * as Yup from 'yup';
import WeekClock from './WeekClock';

interface MyPreferencesTabProps {}

const validationSchema = Yup.object({
  items: Yup.array().of(
    Yup.object({
      available: Yup.boolean().required('To save you must select an option'),
      date: Yup.string().required('Date field is required'),
    }),
  ),
});

const MyPreferencesTab: React.FC<MyPreferencesTabProps> = ({}) => {
  const [currentDate, navigateDays] = useClock();
  const clockTitle = getWeekRange(currentDate);
  const qc = useQueryClient();
  const queryObj = {
    from: moment(currentDate).startOf('week').format(reqMomentFormatting),
    to: moment(currentDate).endOf('week').format(reqMomentFormatting),
  };

  React.useEffect(() => {
    qc.invalidateQueries({queryKey: ['user-preferences']});
    qc.removeQueries({queryKey: ['user-preferences']});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]);

  const {data: userPreferencesData} = useAllUserPreferencesQuery(queryObj);
  const updateUserPreferencesMutation = useUpdateUserPreferencesMutation();
  const repeatPreviousWeekPreferencesMutation =
    useRepeatPreviousWeekUserPreferencesMutation();

  const handleRepeatPreviousWeek = () =>
    repeatPreviousWeekPreferencesMutation.mutateAsync(
      moment(currentDate).startOf('week').format(reqMomentFormatting),
    );

  const handleUpdatePreferences = async (values: {
    items: IUpdateUserPreferences[];
  }) => updateUserPreferencesMutation.mutateAsync(values.items);

  console.log(repeatPreviousWeekPreferencesMutation.error);

  return (
    <View style={{paddingBottom: 10, flex: 1}}>
      <WeekClock
        clockTitle={clockTitle}
        navigateDays={navigateDays}
        week={moment(currentDate).utc().isoWeek().toString()}
      />
      <Snackbar
        isVisible={repeatPreviousWeekPreferencesMutation.isSuccess}
        onClose={() => repeatPreviousWeekPreferencesMutation.reset()}
        duration={1200}
        icon={<Message.Icon type="success" />}>
        <View style={{paddingRight: 20}}>
          <Snackbar.Title>Success!</Snackbar.Title>
          <Snackbar.Subtitle>
            Successfully repeated previous week
          </Snackbar.Subtitle>
        </View>
      </Snackbar>
      <Snackbar
        isVisible={repeatPreviousWeekPreferencesMutation.isError}
        onClose={() => repeatPreviousWeekPreferencesMutation.reset()}
        duration={3000}
        icon={<Message.Icon type="error" />}>
        <View style={{paddingRight: 20}}>
          <Snackbar.Title>Error</Snackbar.Title>
          <Snackbar.Subtitle>
            {repeatPreviousWeekPreferencesMutation.error?.message ??
              'Something went wrong, try again later'}
          </Snackbar.Subtitle>
        </View>
      </Snackbar>
      <Snackbar
        isVisible={updateUserPreferencesMutation.isSuccess}
        onClose={() => updateUserPreferencesMutation.reset()}
        duration={1200}
        icon={<Message.Icon type="success" />}>
        <View style={{paddingRight: 20}}>
          <Snackbar.Title>Success!</Snackbar.Title>
          <Snackbar.Subtitle>Successfully saved current week</Snackbar.Subtitle>
        </View>
      </Snackbar>
      <Snackbar
        isVisible={updateUserPreferencesMutation.isError}
        onClose={() => updateUserPreferencesMutation.reset()}
        duration={3000}
        icon={<Message.Icon type="error" />}>
        <View style={{paddingRight: 20}}>
          <Snackbar.Title>Error</Snackbar.Title>
          <Snackbar.Subtitle>
            {updateUserPreferencesMutation.error?.message ??
              'Something went wrong, try again later'}
          </Snackbar.Subtitle>
        </View>
      </Snackbar>
      <Formik
        initialValues={{
          items: replaceExistingDays(
            moment(currentDate).startOf('week').format(),
            7,
            userPreferencesData ?? ([] as IRecievedUserPreferences[]),
          ),
        }}
        enableReinitialize
        onSubmit={handleUpdatePreferences}
        validationSchema={validationSchema}>
        <FieldArray name="items">
          {() => (
            <>
              <Field name="items">
                {/* @ts-expect-error i dont know how to type this */}
                {({field, form}) => (
                  <>
                    <ScrollView showsVerticalScrollIndicator={false}>
                      {field.value.map(
                        (item: IUpdateUserPreferences, index: number) => (
                          <View key={index} style={{paddingBottom: 0}}>
                            <Text size="2xl" weight="bold">
                              {moment(item.date).format('dddd DD')}
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: 10,
                              }}>
                              <Checkbox
                                value={item.available === true}
                                onChange={() => {
                                  form.setFieldValue(
                                    `items[${index}].available`,
                                    true,
                                  );
                                }}
                                style={{borderRadius: 3}}>
                                Available
                              </Checkbox>
                              <Text
                                size="lg"
                                style={{paddingLeft: 8}}
                                onPress={() => {
                                  form.setFieldValue(
                                    `items[${index}].available`,
                                    true,
                                  );
                                }}>
                                I prefer to work today
                              </Text>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: 10,
                              }}>
                              <Checkbox
                                value={item.available === false}
                                onChange={() => {
                                  form.setFieldValue(
                                    `items[${index}].available`,
                                    false,
                                  );
                                }}
                                style={{borderRadius: 3}}>
                                Not Available
                              </Checkbox>
                              <Text
                                size="lg"
                                style={{paddingLeft: 8}}
                                onPress={() => {
                                  form.setFieldValue(
                                    `items[${index}].available`,
                                    false,
                                  );
                                }}>
                                Unavailable to work today
                              </Text>
                            </View>
                            <ErrorMessage name="items">
                              {msg => (
                                <Text
                                  color="red500"
                                  style={{paddingLeft: 10, paddingBottom: 10}}>
                                  {msg[index] === undefined
                                    ? ''
                                    : Object.values(msg[index]).toString()}
                                </Text>
                              )}
                            </ErrorMessage>
                          </View>
                        ),
                      )}
                    </ScrollView>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        gap: 10,
                        padding: 8,
                        paddingBottom: 0,
                      }}>
                      <Button
                        style={styles.floatingMenuButtonStyle}
                        onPress={handleRepeatPreviousWeek}>
                        Repeat previous week
                      </Button>
                      <Button
                        style={sx(
                          styles.floatingMenuButtonStyle,
                          styles.saveButton,
                        )}
                        type="outlined"
                        onPress={form.handleSubmit}>
                        Save
                      </Button>
                    </View>
                  </>
                )}
              </Field>
            </>
          )}
        </FieldArray>
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingMenuButtonStyle: {
    alignSelf: 'flex-end',
  },
  saveButton: {
    backgroundColor: '#dfe3e8',
  },
});

export default MyPreferencesTab;
