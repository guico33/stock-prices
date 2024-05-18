export type Ticker = 'AAPL' | 'MSFT' | 'AMZN' | 'META';

export type OHLC = 'open' | 'high' | 'low' | 'close';

export type StockPrice = {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
};
