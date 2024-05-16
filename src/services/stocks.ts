// https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2023-01-09/2023-01-09?adjusted=true&sort=asc&apiKey=PZabAF2pajdGTZAcDeIKY_Xqs2A0GLUh

import PolygonAPI from '../api/polygon';

import { useQuery } from '@tanstack/react-query';
import { getTimeSpanAndMultiplier } from '../utils/date-range';

type GetStockPricesParams = {
  ticker: string;
  startDate: string;
  endDate: string;
};

export const getStockPrices = async ({ ticker, startDate, endDate }: GetStockPricesParams) => {
  const { timespan, multiplier } = getTimeSpanAndMultiplier({
    startDate: startDate,
    endDate: endDate,
  });
  const response = await PolygonAPI.get(
    `/aggs/ticker/${ticker}/range/${multiplier}/${timespan}/${startDate}/${endDate}?adjusted=true&sort=asc`,
  );
  return response.data.results;
};

export const useStockPrices = ({ ticker, startDate, endDate }: GetStockPricesParams) => {
  const query = useQuery({
    queryKey: ['stockPrices', ticker, startDate, endDate],
    queryFn: () => getStockPrices({ ticker, startDate, endDate }),
  });

  return query;
};
