import dayjs from 'dayjs';

import { DateRange } from '../types/dates';
import { OHLC, StockPrice, Ticker } from '../types/stocks';
import { formatDateReadable } from './dates';

export const transformData = (
  data: Record<Ticker, StockPrice[]>,
  ohlc: OHLC,
  [startDate, endDate]: DateRange,
) => {
  return Object.entries(data).map(([ticker, prices]) => {
    const filteredPrices = prices.filter((price) =>
      dayjs(price.date).isBetween(startDate, endDate),
    );
    return {
      // necessary to for the chart to update when the data changes
      // https://github.com/plouc/nivo/issues/1006
      id: `${ticker}-${startDate}-${endDate}`,
      data: filteredPrices.map((price) => ({
        x: formatDateReadable(price.date),
        y: price[ohlc],
      })),
    };
  });
};
