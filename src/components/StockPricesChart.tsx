import { Box, Paper, Typography } from '@mui/material';
import { ResponsiveLine } from '@nivo/line';
import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';

import { MAX_DAY_SHOW_HOURS } from '../constants/config';
import { tickerToColor } from '../constants/stocks';
import { DateRange } from '../types/dates';
import { OHLC, StockPrice, Ticker } from '../types/stocks';
import { toNivoLineData } from '../utils/charts';
import { formatDateReadable, getDiffDays } from '../utils/dates';

type StockPricesChartProps = {
  dateRange: DateRange;
  ohlc: OHLC;
  data: Record<Ticker, StockPrice[]>;
};

const getTickerFromSerieId = (seriesId: string | number) =>
  seriesId.toString().split('-')[0] as Ticker;

const StockPricesChart = ({
  data,
  ohlc,
  dateRange: [startDate, endDate],
}: StockPricesChartProps) => {
  const transformedData = useMemo(
    () => toNivoLineData(data, ohlc, [startDate, endDate]),
    [data, endDate, startDate, ohlc],
  );

  const nbDays = useMemo(() => getDiffDays(startDate, endDate), [startDate, endDate]);

  const precision: 'day' | 'hour' = useMemo(() => {
    if (nbDays <= MAX_DAY_SHOW_HOURS) return 'hour';
    return 'day';
  }, [nbDays]);

  const tickValues = useMemo(() => {
    switch (precision) {
      case 'hour': {
        return 'every 4 hours';
      }
      default: {
        const interval = Math.round(nbDays / 10);
        return `every ${interval} days`;
      }
    }
  }, [nbDays, precision]);

  const xFormat = precision === 'hour' ? '%d/%m/%Y %H:%M' : '%d/%m/%Y';

  const tickFormatter = useCallback(
    (value: string) => {
      if (precision === 'hour') return dayjs(value).format('HH');
      return formatDateReadable(value);
    },
    [precision],
  );

  return (
    <ResponsiveLine
      tooltip={({ point }) => (
        <Paper>
          <Box display="flex" flexDirection="column" p={1}>
            <Typography variant="body2" color={tickerToColor[getTickerFromSerieId(point.serieId)]}>
              {getTickerFromSerieId(point.serieId)}
            </Typography>
            <Typography variant="caption">Date: {point.data.xFormatted}</Typography>
            <Typography variant="caption">Price: {point.data.yFormatted}</Typography>
          </Box>
        </Paper>
      )}
      data={transformedData}
      margin={{ top: 20, right: 40, bottom: 60, left: 40 }}
      xScale={{
        type: 'time',
        format: xFormat,
        useUTC: false,
        precision,
      }}
      xFormat={`time:${xFormat}`}
      yScale={{ type: 'linear' }}
      axisBottom={{
        format: tickFormatter,
        tickValues,
        legendOffset: -12,
      }}
      curve="linear"
      useMesh={true}
      enableSlices={false}
      enablePoints={false}
      animate={true}
      enableTouchCrosshair={true}
      colors={(d: { id: string }) => tickerToColor[getTickerFromSerieId(d.id)]}
    />
  );
};

export default StockPricesChart;
