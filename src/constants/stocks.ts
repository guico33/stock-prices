import { OHLC, Ticker } from '../types/stocks';

export const tickers: Ticker[] = ['AAPL', 'AMZN', 'MSFT', 'META'] as const;

export const tickerToName: Record<Ticker, string> = {
  AAPL: 'Apple',
  AMZN: 'Amazon',
  MSFT: 'Microsoft',
  META: 'Meta',
};

export const tickerToColor: Record<Ticker, string> = {
  AAPL: '#A3AAAE',
  AMZN: '#FF9900',
  MSFT: '#00A4EF',
  META: '#1877F2',
};

export const pricesTypes: OHLC[] = ['open', 'high', 'low', 'close'] as const;

export const ohlcToLabel: Record<OHLC, string> = {
  open: 'Open',
  high: 'High',
  low: 'Low',
  close: 'Close',
};
