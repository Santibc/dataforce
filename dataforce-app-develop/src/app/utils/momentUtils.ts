import {
  IRecievedUserPreferences,
  IUpdateUserPreferences,
} from 'app/api/userPreferencesRepository';
import moment from 'moment';

export const momentFormatting = 'MMM DD';
export const reqMomentFormatting = 'YYYY-MM-DD HH:mm:ss';

export function getWeekRange(date: string) {
  try {
    const currentDate = moment(date);
    return `${currentDate
      .clone()
      .startOf('week')
      .format(momentFormatting)} - ${currentDate
      .clone()
      .endOf('week')
      .format(`${momentFormatting}, YYYY`)}`;
  } catch (error) {
    throw new Error('date is not a moment string');
  }
}

export function getTimelineHeaders(
  date: string,
  days: number,
  format?: string,
): string[] {
  if (days < 0) {
    return getTimelineHeaders(
      moment(date).subtract(days, 'days').format(),
      Math.abs(days),
    );
  }
  const headers = [];
  for (let index = 0; index < days; index++) {
    headers.push(moment(date).add(index, 'days').format(format));
  }
  return headers;
}

export function replaceExistingDays(
  date: string,
  days: number,
  data: IRecievedUserPreferences[],
) {
  const allDays = getTimelineHeaders(date, days).map(
    time => ({date: time} as IUpdateUserPreferences),
  );
  for (let index = 0; index < allDays.length; index++) {
    for (let index2 = 0; index2 < data.length; index2++) {
      if (moment(data[index2].date).isSame(allDays[index].date, 'day')) {
        allDays[index] = data[index2];
      }
    }
  }
  return allDays;
}
