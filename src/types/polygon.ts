export type Multiplier = number;

export type Timespan = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';

export type SortDirection = 'asc' | 'desc';

export type StockPriceDataPoint = {
  o: number;
  c: number;
  h: number;
  l: number;
  t: number;
};
