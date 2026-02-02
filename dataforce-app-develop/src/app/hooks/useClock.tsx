import { useState } from 'react';
import moment from 'moment';

type NavigateDaysFunction = (days: number) => void;
type SetCurrentDateFunction = (date: string) => void;
type ClockHook = [string, NavigateDaysFunction, SetCurrentDateFunction];

/**
 * A custom hook for managing a clock with a current date and navigation functions.
 *
 * @param {string} [initialState] - Optional initial date in string format (default is the current date).
 * @returns {[string, (days: number) => void]} A tuple containing the current date and the navigateDays function.
 *
 * @example
 * const [currentDate, navigateDays] = useClock(); // Uses the default initialState
 * // OR
 * const [currentDate, navigateDays] = useClock('2023-01-11'); // Provide a custom initialState
 */
const useClock = (initialState: string = moment().format()): ClockHook => {
    const [currentDate, setCurrentDate] = useState<string>(initialState);
    const navigateDays: NavigateDaysFunction = (days: number): void => {
        setCurrentDate(
            moment(currentDate)
                .add(days, 'days')
                .format()
        );
    };


    return [currentDate, navigateDays, setCurrentDate];
};

export default useClock;

