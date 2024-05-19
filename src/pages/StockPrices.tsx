import { Alert, Box, Button, CircularProgress, Paper, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import DateRangeSlider from '../components/DateRangeSlider';
import LayoutToggle from '../components/LayoutToggle';
import MultiSelectField from '../components/MultiSelectField';
import RadioButtonGroup from '../components/RadioButtonGroup';
import StockPricesChart from '../components/StockPricesChart';
import {
  DEFAULT_OHLC,
  DEFAULT_TICKER,
  MAX_DATE,
  MAX_DAY_SHOW_HOURS,
  MAX_DAYS_FETCH_GRANULAR_DATA,
  MAX_SELECTED_TICKERS,
  MIN_DATE,
} from '../constants/config';
import {
  ohlcToLabel,
  pricesTypes,
  tickers,
  tickerToColor,
  tickerToName,
} from '../constants/stocks';
import { GetMultipleStockPricesParams, useGetStockPrices } from '../services/stocks';
import { DateRange } from '../types/dates';
import { OHLC, Ticker } from '../types/stocks';
import { Layout } from '../types/ui';
import { getDiffDays } from '../utils/dates';

type FormValues = {
  selectedTickers: Ticker[];
  ohlc: OHLC;
};

const StockPrices = () => {
  const [dateRange, setDateRange] = useState<DateRange>([MIN_DATE, MAX_DATE]);

  const [layout, setLayout] = useState<Layout>('compact');

  const [dateRangeParams, setDateRangeParams] = useState<DateRange>([MIN_DATE, MAX_DATE]);

  const handleChangeDateRange = (value: DateRange) => {
    setDateRange(value);
  };

  // debounce date range changes by 1 second
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDateRangeParams(dateRange);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [dateRange]);

  const { control, watch } = useForm<FormValues>({
    defaultValues: {
      selectedTickers: [DEFAULT_TICKER],
      ohlc: DEFAULT_OHLC,
    },
  });

  const { selectedTickers, ohlc } = watch();

  const getSockPricesParams: GetMultipleStockPricesParams = useMemo(() => {
    const [startDateParam, endDateParams] = dateRangeParams;
    const nbDays = getDiffDays(startDateParam, endDateParams);

    // if the date range is more than 90 days, we set start and end date to min and max date
    // in order to avoid sending too many requests
    // chart will still be plotted based on the user selected date range
    const startDate = nbDays > MAX_DAYS_FETCH_GRANULAR_DATA ? MIN_DATE : startDateParam;
    const endDate = nbDays > MAX_DAYS_FETCH_GRANULAR_DATA ? MAX_DATE : endDateParams;

    const timespan = nbDays <= MAX_DAY_SHOW_HOURS ? 'hour' : 'day';

    return {
      tickers: selectedTickers,
      startDate,
      endDate,
      timespan,
      multiplier: 1,
    };
  }, [dateRangeParams, selectedTickers]);

  const { data, isLoading, hasError, refetch, error, clearError } =
    useGetStockPrices(getSockPricesParams);

  const tickersOptions = tickers.map((ticker) => ({
    label: `${ticker} (${tickerToName[ticker]})`,
    value: ticker,
    color: tickerToColor[ticker],
  }));

  const ohlcOptions = pricesTypes.map((ohlc) => ({
    label: ohlcToLabel[ohlc],
    value: ohlc,
  }));

  return (
    <Box px={[2, 2, 4, 6]} py={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={4}>
          <Typography variant="h4" textAlign="center" my={4} whiteSpace="nowrap">
            Stock Prices
          </Typography>
          {error && (
            <Alert onClose={clearError} severity="error" variant="outlined" sx={{ width: '100%' }}>
              {error}
            </Alert>
          )}
        </Box>
        <LayoutToggle
          layout={layout}
          setLayout={setLayout}
          sx={{
            height: '40px',
            display: {
              xs: 'none',
              sm: 'none',
              md: 'none',
              lg: 'flex',
              xl: 'flex',
            },
          }}
        />
      </Box>
      <Box
        display="grid"
        gridTemplateColumns={['1fr', '1fr', '1fr', layout === 'full' ? '1fr' : '1.4fr 1fr']}
        gap={4}
      >
        <Paper elevation={3}>
          <Box height={500} p={1} pt={3}>
            {isLoading && (
              <Box display="flex" justifyContent="center" height="500px" mt="200px">
                <CircularProgress />
              </Box>
            )}
            {!hasError && !isLoading && (
              <StockPricesChart key={layout} data={data} ohlc={ohlc} dateRange={dateRangeParams} />
            )}
            {hasError && !isLoading && (
              <Box display="flex" justifyContent="center" mt="200px">
                <Button variant="outlined" onClick={() => refetch()}>
                  Refetch data
                </Button>
              </Box>
            )}
          </Box>
        </Paper>
        <Paper
          elevation={3}
          sx={{
            height: 'fit-content',
            width: '100%',
          }}
        >
          <Box p={2} display="flex" gap={2} flexWrap="wrap">
            <Box display="flex" flexDirection="column" gap={4}>
              <MultiSelectField
                control={control}
                name="selectedTickers"
                label="Tickers"
                options={tickersOptions}
                maxSelected={MAX_SELECTED_TICKERS}
              />

              <RadioButtonGroup control={control} name="ohlc" label="OHLC" options={ohlcOptions} />
            </Box>

            <Box display="flex" flexDirection="column" gap={2} flexGrow={1} minWidth="500px">
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="h6">Date Range</Typography>
                </Box>
                <Button variant="outlined" onClick={() => setDateRange([MIN_DATE, MAX_DATE])}>
                  Reset
                </Button>
              </Box>

              <DateRangeSlider
                onChange={handleChangeDateRange}
                dateRangeParams={dateRangeParams}
                value={dateRange}
                px={1.5}
              />
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default StockPrices;
