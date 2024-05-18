import Box, { BoxProps } from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import dayjs from 'dayjs';
import { useMemo } from 'react';

import { maxDate, minDate } from '../constants/stocks';
import { DateRange } from '../types/dates';
import { formatDateReadable, getDiffDays } from '../utils/dates';

type DateRangeSliderProps = {
  value: DateRange;
  onChange: (value: DateRange) => void;
  dateRangeParams: DateRange;
  disabled?: boolean;
} & Omit<BoxProps, 'onChange'>;

const DateRangeSlider = ({
  value,
  onChange,
  dateRangeParams,
  disabled,
  ...boxProps
}: DateRangeSliderProps) => {
  const dateRangeSliderMinDate = useMemo(() => {
    if (dayjs(dateRangeParams[0]).isAfter(minDate)) {
      return dateRangeParams[0];
    } else {
      return minDate;
    }
  }, [dateRangeParams]);

  const dateRangeSliderMaxDate = useMemo(() => {
    if (dayjs(dateRangeParams[1]).isBefore(maxDate)) {
      return dateRangeParams[1];
    } else {
      return maxDate;
    }
  }, [dateRangeParams]);

  const minTime = dateRangeSliderMinDate.valueOf();
  const maxTime = dateRangeSliderMaxDate.valueOf();

  const step = useMemo(() => {
    const diffDays = getDiffDays(dateRangeSliderMinDate, dateRangeSliderMaxDate);
    if (diffDays < 7) {
      return (24 * 60 * 60 * 1000) / 2; // half a day
    } else if (diffDays < 30) {
      return 24 * 60 * 60 * 1000 * 2; // 2 days
    } else if (diffDays < 365) {
      return 24 * 60 * 60 * 1000 * 5; // 10 days
    } else {
      return 24 * 60 * 60 * 1000 * 30; // one month
    }
  }, [dateRangeSliderMinDate, dateRangeSliderMaxDate]);

  const marks = useMemo(() => {
    // shows first and last date
    return [
      {
        value: minTime,
        label: formatDateReadable(dateRangeSliderMinDate),
      },
      {
        value: maxTime,
        label: formatDateReadable(dateRangeSliderMaxDate),
      },
    ];
  }, [minTime, dateRangeSliderMinDate, maxTime, dateRangeSliderMaxDate]);

  return (
    <Box {...boxProps}>
      <Slider
        sx={{
          '.MuiSlider-markLabel': {
            '&[data-index="0"]': {
              marginLeft: 3,
            },
            '&[data-index="1"]': {
              paddingRight: 6,
            },
          },
        }}
        getAriaLabel={() => 'Date range'}
        value={value.map((v: Date) => v.valueOf())}
        min={minTime}
        max={maxTime}
        step={step}
        disabled={disabled}
        onChange={(_, newValue) => {
          if (Array.isArray(newValue)) {
            const [newMin, newMax] = newValue as number[];
            // prevent the range from being less than 2 days
            if (newMax - newMin < 2 * 24 * 60 * 60 * 1000) {
              return;
            }
          }
          onChange(
            (Array.isArray(newValue)
              ? (newValue as number[]).map((v) => new Date(v))
              : []) as DateRange,
          );
        }}
        valueLabelDisplay="auto"
        getAriaValueText={formatDateReadable}
        valueLabelFormat={formatDateReadable}
        marks={marks}
        disableSwap
      />
    </Box>
  );
};

export default DateRangeSlider;
