import { useQueries, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import PolygonAPI from '../api/polygon';
import { MAX_DATE, MIN_DATE } from '../constants/config';
import { StockPriceDataPoint, Timespan } from '../types/polygon';
import { StockPrice, Ticker } from '../types/stocks';
import { getErrorMessage } from '../utils/api';
import { dataPointToStockPrice } from '../utils/data';
import { formatDateApi } from '../utils/dates';

type GetSingleStockPricesParams = {
  ticker: Ticker;
  startDate: string;
  endDate: string;
  timespan: Timespan;
  multiplier: number;
  nextUrl?: string;
};

export type GetSingleStockPricesResponse = {
  results: StockPriceDataPoint[];
};

export type GetMultipleStockPricesParams = {
  tickers: Ticker[];
  startDate: string | Date;
  endDate: string | Date;
  timespan: Timespan;
  multiplier: number;
};

export const getStockPrices = async ({
  ticker,
  startDate,
  endDate,
  timespan,
  multiplier,
}: GetSingleStockPricesParams): Promise<StockPrice[]> => {
  // assume a single page of data
  const response = await PolygonAPI.get<GetSingleStockPricesResponse>(
    `/aggs/ticker/${ticker}/range/${multiplier}/${timespan}/${startDate}/${endDate}?adjusted=true&sort=asc`,
  );

  const data = response.data.results.map(dataPointToStockPrice);

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
      formatDateApi(MIN_DATE),
      formatDateApi(MAX_DATE),
    ]);
    acc[ticker] = dataMaxRange ?? [];
    return acc;
  }, {} as Record<Ticker, StockPrice[]>);

  let data = queries.reduce((acc, query, index) => {
    const ticker = tickers[index];
    if (query.status === 'success' && ticker !== undefined) {
      acc[ticker] = query.data;
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
