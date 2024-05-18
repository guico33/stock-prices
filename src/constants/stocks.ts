import dayjs from 'dayjs';
import { OHLC, Ticker } from '../types/stocks';

export const tickers: Ticker[] = ['AAPL', 'AMZN', 'MSFT', 'META'] as const;

export const tickerToName: Record<Ticker, string> = {
  AAPL: 'Apple',
  AMZN: 'Amazon',
  MSFT: 'Microsoft',
  META: 'Meta',
};

export const tickerToColor: Record<Ticker, string> = {
  AAPL: '#8884d8',
  AMZN: '#82ca9d',
  MSFT: '#ffc658',
  META: '#ff7300',
};

export const pricesTypes: OHLC[] = ['open', 'high', 'low', 'close'] as const;

export const ohlcToLabel: Record<OHLC, string> = {
  open: 'Open',
  high: 'High',
  low: 'Low',
  close: 'Close',
};

export const minDate = dayjs().subtract(1, 'year').toDate();

export const maxDate = dayjs().subtract(1, 'day').toDate();
