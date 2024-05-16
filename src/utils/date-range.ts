// multiplier:

import { Multiplier, Timespan } from '../types/polygon';
import { differenceInDays } from 'date-fns';

export const getTimeSpanAndMultiplier = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}): {
  timespan: Timespan;
  multiplier: Multiplier;
} => {
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  const daysBetween = differenceInDays(endDateObj, startDateObj);
  let timespan: Timespan;
  let multiplier: Multiplier;

  if (daysBetween < 7) {
    timespan = 'day';
    multiplier = 1;
  } else if (daysBetween < 30) {
    timespan = 'week';
    multiplier = 1;
  } else if (daysBetween < 90) {
    timespan = 'month';
    multiplier = 1;
  } else if (daysBetween < 365) {
    timespan = 'month';
    multiplier = 3;
  } else {
    timespan = 'year';
    multiplier = 1;
  }

  return { timespan, multiplier };
};
