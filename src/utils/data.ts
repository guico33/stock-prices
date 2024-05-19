import { StockPriceDataPoint } from '../types/polygon';
import { StockPrice } from '../types/stocks';

export const dataPointToStockPrice = (dataPoint: StockPriceDataPoint): StockPrice => ({
  date: new Date(dataPoint.t),
  open: dataPoint.o,
  close: dataPoint.c,
  high: dataPoint.h,
  low: dataPoint.l,
});
