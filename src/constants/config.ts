import dayjs from 'dayjs';

import { OHLC, Ticker } from '../types/stocks';

export const MAX_SELECTED_TICKERS: number = 3;

export const DEFAULT_TICKER: Ticker = 'AAPL';

export const DEFAULT_OHLC: OHLC = 'close';

export const MAX_DAYS_FETCH_GRANULAR_DATA: number = 90;

export const MAX_DAY_SHOW_HOURS: number = 5;

export const MIN_DATE = dayjs().subtract(1, 'year').toDate();

export const MAX_DATE = dayjs().subtract(1, 'day').toDate();
