import { useQueries, useQueryClient } from '@tanstack/react-query';
import PolygonAPI from '../api/polygon';
import { StockPriceDataPoint, Timespan } from '../types/polygon';
import { StockPrice, Ticker } from '../types/stocks';
import { maxDate, minDate } from '../constants/stocks';
import { formatDateApi } from '../utils/dates';
import { getErrorMessage } from '../utils/api';
import { useEffect, useState } from 'react';

type GetSingleStockPricesParams = {
  ticker: Ticker;
  startDate: string;
  endDate: string;
  timespan: Timespan;
  multiplier: number;
  nextUrl?: string;
};

type GetSingleStockPricesResponse = {
  results: StockPriceDataPoint[];
};

export type GetMultipleStockPricesParams = {
  tickers: Ticker[];
  startDate: string | Date;
  endDate: string | Date;
  timespan: Timespan;
  multiplier: number;
};

const transformDataPoint = (dataPoint: StockPriceDataPoint): StockPrice => ({
  date: new Date(dataPoint.t),
  open: dataPoint.o,
  close: dataPoint.c,
  high: dataPoint.h,
  low: dataPoint.l,
});

export const getStockPrices = async ({
  ticker,
  startDate,
  endDate,
  timespan,
  multiplier,
}: GetSingleStockPricesParams): Promise<StockPrice[]> => {
  const response = await PolygonAPI.get<GetSingleStockPricesResponse>(
    `/aggs/ticker/${ticker}/range/${multiplier}/${timespan}/${startDate}/${endDate}?adjusted=true&sort=asc`,
  );

  const data = response.data.results.map(transformDataPoint);

  return data;
};

export const useGetStockPrices = ({
  tickers,
  startDate,
  endDate,
  timespan,
  multiplier,
}: GetMultipleStockPricesParams) => {
  const formattedStartDate = formatDateApi(startDate);
  const formattedEndDate = formatDateApi(endDate);

  const queries = useQueries({
    queries: tickers.map((ticker) => ({
      queryKey: ['stockPrices', ticker, formattedStartDate, formattedEndDate, timespan, multiplier],
      queryFn: () =>
        getStockPrices({
          ticker,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          timespan,
          multiplier,
        }),
      refetchOnMount: false,
      cacheTime: Infinity,
      staleTime: Infinity,
    })),
  });

  const queryClient = useQueryClient();

  const dataMaxRange = tickers.reduce((acc, ticker) => {
    const dataMaxRange = queryClient.getQueryData<StockPrice[]>([
      'stockPrices',
      ticker,
      formatDateApi(minDate),
      formatDateApi(maxDate),
    ]);
    acc[ticker] = dataMaxRange ?? [];
    return acc;
  }, {} as Record<Ticker, StockPrice[]>);

  let data = queries.reduce((acc, query, index) => {
    if (query.status === 'success') {
      acc[tickers[index]] = query.data;
    }
    return acc;
  }, {} as Record<Ticker, StockPrice[]>);

  // if all queries are empty, use the max range data (which might also be empty)
  if (Object.values(data).every((prices) => prices.length === 0)) {
    data = dataMaxRange;
  }

  const queryError = queries.find((query) => query.error)?.error;
  const errorMessage = queryError ? getErrorMessage(queryError) : null;

  const [error, setError] = useState<string | null>(null);
  const [lastErrorTime, setLastErrorTime] = useState(0);

  useEffect(() => {
    const now = Date.now();
    if (queryError && now - lastErrorTime >= 3000) {
      setError(errorMessage);
      setLastErrorTime(now);
    } else if (!queryError) {
      setError(null);
    }
  }, [queryError, errorMessage, lastErrorTime]);

  const clearError = () => {
    setError(null);
  };

  const refetch = () => {
    clearError();
    queries.forEach((query) => {
      query.refetch();
    });
  };

  const isLoading = queries.some((query) => query.status === 'pending');

  const hasError = queries.some((query) => query.status === 'error');

  return { data, isLoading, hasError, refetch, error, clearError };
};
