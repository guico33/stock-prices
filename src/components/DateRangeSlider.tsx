import Box, { BoxProps } from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

import { MAX_DATE, MIN_DATE } from '../constants/config';
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
  const [localValue, setLocalValue] = useState<DateRange>(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const dateRangeSliderMinDate = useMemo(() => {
    if (dayjs(dateRangeParams[0]).isAfter(MIN_DATE)) {
      return dateRangeParams[0];
    } else {
      return MIN_DATE;
    }
  }, [dateRangeParams]);

  const dateRangeSliderMaxDate = useMemo(() => {
    if (dayjs(dateRangeParams[1]).isBefore(MAX_DATE)) {
      return dateRangeParams[1];
    } else {
      return MAX_DATE;
    }
  }, [dateRangeParams]);

  const minTime = dateRangeSliderMinDate.valueOf();
  const maxTime = dateRangeSliderMaxDate.valueOf();

  const step = useMemo(() => {
    const diffDays = getDiffDays(dateRangeSliderMinDate, dateRangeSliderMaxDate);
    const unixDay = 24 * 60 * 60 * 1000;
    if (diffDays < 30) {
      return unixDay;
    } else if (diffDays < 365) {
      return unixDay * 5;
    } else {
      return unixDay * 30;
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

  const isNewValueValid = (newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      const [newMin, newMax] = newValue as [number, number];
      // prevent the user from selecting a range shorter than 2 days
      if (getDiffDays(newMin, newMax) < 2) {
        return false;
      }
    }
    return true;
  };

  const handleChange = (newValue: number | number[]) => {
    if (!isNewValueValid(newValue)) return;
    setLocalValue(
      (Array.isArray(newValue) ? (newValue as number[]).map((v) => new Date(v)) : []) as DateRange,
    );
  };

  const handleChangeCommitted = (newValue: number | number[]) => {
    if (isNewValueValid(newValue)) {
      onChange(
        (Array.isArray(newValue)
          ? (newValue as number[]).map((v) => new Date(v))
          : []) as DateRange,
      );
    }
  };

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
          '.MuiSlider-track': {
            height: '3px',
          },
        }}
        getAriaLabel={() => 'Date range'}
        value={localValue.map((v: Date) => v.valueOf())}
        min={minTime}
        max={maxTime}
        step={step}
        disabled={disabled}
        onChange={(_, newValue) => handleChange(newValue)}
        onChangeCommitted={(_, newValue) => handleChangeCommitted(newValue)}
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
