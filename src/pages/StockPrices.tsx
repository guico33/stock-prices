import { Box, Button, CircularProgress, Paper, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import MultipleSelectField from '../components/MultipleSelectField';
import {
  maxDate,
  minDate,
  ohlcToLabel,
  pricesTypes,
  tickerToColor,
  tickerToName,
  tickers,
} from '../constants/stocks';
import { GetMultipleStockPricesParams, useGetStockPrices } from '../services/stocks';
import { OHLC, Ticker } from '../types/stocks';
import StockPricesChart from '../components/StockPricesChart';
import DateRangeSlider from '../components/DateRangeSlider';
import { useEffect, useMemo, useState } from 'react';
import { DateRange } from '../types/dates';
import { getDiffDays } from '../utils/dates';
import RadioButtonGroup from '../components/RadioButtonGroup';
import LayoutToggle from '../components/LayoutToggle.t';
import { Layout } from '../types/ui';

type FormValues = {
  selectedTickers: Ticker[];
  ohlc: OHLC;
};

const StockPrices = () => {
  const [dateRange, setDateRange] = useState<DateRange>([minDate, maxDate]);

  const [layout, setLayout] = useState<Layout>('compact');

  const [dateRangeParams, setDateRangeParams] = useState<DateRange>([minDate, maxDate]);

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
      selectedTickers: ['AAPL'],
      ohlc: 'close',
    },
  });

  const { selectedTickers, ohlc } = watch();

  const getSockPricesParams: GetMultipleStockPricesParams = useMemo(() => {
    const [startDateParam, endDateParams] = dateRangeParams;
    const nbDays = getDiffDays(startDateParam, endDateParams);

    // if the date range is more than 90 days, we set start and end date to min and max date
    // in order to avoid making too many requests
    // chart will be plotted based on the user selected date range
    const startDate = nbDays > 90 ? minDate : startDateParam;
    const endDate = nbDays > 90 ? maxDate : endDateParams;

    const timespan = nbDays < 2 ? 'hour' : 'day';

    return {
      tickers: selectedTickers,
      startDate,
      endDate,
      timespan,
      multiplier: 1,
    };
  }, [dateRangeParams, selectedTickers]);

  const { data, isLoading, hasError, refetch } = useGetStockPrices(getSockPricesParams);

  const hasData = data && Object.values(data).some((prices) => prices.length > 0);

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
        <Typography variant="h4" textAlign="center" my={4}>
          Stock Prices
        </Typography>
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
            {((!hasData && !hasError) || (hasError && isLoading)) && (
              <Box display="flex" justifyContent="center" height="500px" mt="200px">
                <CircularProgress />
              </Box>
            )}
            {hasData && !hasError && (
              <StockPricesChart
                key={layout}
                data={data}
                tickers={tickers}
                ohlc={ohlc}
                dateRange={dateRangeParams}
              />
            )}
            {hasError && !isLoading && (
              <Box display="flex" justifyContent="center" mt="170px">
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
              <MultipleSelectField
                control={control}
                name="selectedTickers"
                label="Tickers"
                options={tickersOptions}
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
                  <Typography variant="h6">Date Range </Typography>
                </Box>
                <Button variant="outlined" onClick={() => setDateRange([minDate, maxDate])}>
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
