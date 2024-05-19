import { fireEvent, screen, waitFor } from '@testing-library/react';
import dayjs from 'dayjs';
import { when } from 'jest-when';
import { act } from 'react';

import * as StockPricesChart from '../../components/StockPricesChart';
import {
  DEFAULT_OHLC,
  DEFAULT_TICKER,
  MAX_DATE,
  MAX_DAY_SHOW_HOURS,
  MAX_DAYS_FETCH_GRANULAR_DATA,
  MIN_DATE,
} from '../../constants/config';
import { ohlcToLabel, tickers, tickerToName } from '../../constants/stocks';
import * as stocksService from '../../services/stocks';
import { OHLC, StockPrice, Ticker } from '../../types/stocks';
import * as ChartUtils from '../../utils/charts';
import { dataPointToStockPrice } from '../../utils/data';
import { formatDateApi } from '../../utils/dates';
import { MockAxiosError, renderWithProviders } from '../../utils/testing';
import StockPrices from '../StockPrices';
import { generateMaxRangePolygonResponse } from './fixtures';

jest.mock('axios', () => ({
  ...jest.requireActual('axios'),
  isAxiosError: jest.fn(() => true),
}));

describe('StockPrices', () => {
  let getStockPricesSpy: jest.SpyInstance;
  let stockPricesChartSpy: jest.SpyInstance;
  let toNivoLineDataSpy: jest.SpyInstance;

  const maxRangeStockPrices: Record<Ticker, StockPrice[]> = {
    AAPL: generateMaxRangePolygonResponse().results.map(dataPointToStockPrice),
    AMZN: generateMaxRangePolygonResponse().results.map(dataPointToStockPrice),
    META: generateMaxRangePolygonResponse().results.map(dataPointToStockPrice),
    MSFT: generateMaxRangePolygonResponse().results.map(dataPointToStockPrice),
  };

  const defaultTicker: Ticker = DEFAULT_TICKER;
  const defaultOhlc: OHLC = DEFAULT_OHLC;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    getStockPricesSpy = jest.spyOn(stocksService, 'getStockPrices');
    tickers.forEach((ticker) => {
      when(getStockPricesSpy)
        .calledWith({
          startDate: formatDateApi(MIN_DATE),
          endDate: formatDateApi(MAX_DATE),
          multiplier: 1,
          ticker,
          timespan: 'day',
        })
        .mockResolvedValue(maxRangeStockPrices[ticker]);
    });
    stockPricesChartSpy = jest.spyOn(StockPricesChart, 'default');
    toNivoLineDataSpy = jest.spyOn(ChartUtils, 'toNivoLineData');
  });

  it('should fetch stock prices with the default params and pass the data to the chart component', async () => {
    renderWithProviders(<StockPrices />);

    expect(screen.getByText('Stock Prices')).toBeInTheDocument();

    await waitFor(() => {
      expect(getStockPricesSpy).toHaveBeenCalledTimes(1);
    });

    expect(getStockPricesSpy).toHaveBeenCalledWith({
      startDate: formatDateApi(MIN_DATE),
      endDate: formatDateApi(MAX_DATE),
      multiplier: 1,
      ticker: defaultTicker,
      timespan: 'day',
    });

    await screen.findByText('MockedChart');

    await waitFor(() => {
      expect(stockPricesChartSpy).toHaveBeenCalledWith(
        {
          dateRange: [MIN_DATE, MAX_DATE],
          data: {
            [defaultTicker]: maxRangeStockPrices[defaultTicker],
          },
          ohlc: defaultOhlc,
        },
        {},
      );
    });

    act(() => {
      jest.runAllTimers();
    });
  });

  describe('date range selection', () => {
    it('can change the date range and fetch new stock prices', async () => {
      renderWithProviders(<StockPrices />);

      expect(screen.getByText('Stock Prices')).toBeInTheDocument();

      await waitFor(() => {
        expect(getStockPricesSpy).toHaveBeenCalledWith({
          startDate: formatDateApi(MIN_DATE),
          endDate: formatDateApi(MAX_DATE),
          multiplier: 1,
          ticker: defaultTicker,
          timespan: 'day',
        });
      });

      const dateRangeInputs: HTMLInputElement[] = screen.getAllByLabelText('Date range');

      expect(dateRangeInputs).toHaveLength(2);

      const newDateTime = dayjs(MIN_DATE)
        .add(MAX_DAYS_FETCH_GRANULAR_DATA - 5, 'day')
        .valueOf();

      const endDateInput = dateRangeInputs[1];

      if (!endDateInput) throw new Error('End date input not found');

      fireEvent.change(endDateInput, {
        target: { value: newDateTime },
      });

      act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(getStockPricesSpy).toHaveBeenCalledWith({
          startDate: formatDateApi(MIN_DATE),
          endDate: formatDateApi(newDateTime),
          multiplier: 1,
          ticker: defaultTicker,
          timespan: 'day',
        });
      });

      expect(getStockPricesSpy).toHaveBeenCalledTimes(2);
    });

    it(`should not fetch new prices if the timeframe is more than ${MAX_DAYS_FETCH_GRANULAR_DATA} days`, async () => {
      renderWithProviders(<StockPrices />);

      expect(screen.getByText('Stock Prices')).toBeInTheDocument();

      await waitFor(() => {
        expect(getStockPricesSpy).toHaveBeenCalledWith({
          startDate: formatDateApi(MIN_DATE),
          endDate: formatDateApi(MAX_DATE),
          multiplier: 1,
          ticker: defaultTicker,
          timespan: 'day',
        });
      });

      const dateRangeInputs: HTMLInputElement[] = screen.getAllByLabelText('Date range');

      expect(dateRangeInputs).toHaveLength(2);

      const newDateTime = dayjs(MIN_DATE)
        .add(MAX_DAYS_FETCH_GRANULAR_DATA + 10, 'day')
        .valueOf();

      const endDateInput = dateRangeInputs[1];

      if (!endDateInput) throw new Error('End date input not found');

      fireEvent.change(endDateInput, {
        target: { value: newDateTime },
      });

      act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(getStockPricesSpy).toHaveBeenCalledTimes(1);
      });
    });

    it(`should fetch prices with an hourly timespan if the date range is less than ${MAX_DAY_SHOW_HOURS} days`, async () => {
      renderWithProviders(<StockPrices />);

      expect(screen.getByText('Stock Prices')).toBeInTheDocument();

      await waitFor(() => {
        expect(getStockPricesSpy).toHaveBeenCalledWith({
          startDate: formatDateApi(MIN_DATE),
          endDate: formatDateApi(MAX_DATE),
          multiplier: 1,
          ticker: defaultTicker,
          timespan: 'day',
        });
      });

      const dateRangeInputs: HTMLInputElement[] = screen.getAllByLabelText('Date range');

      expect(dateRangeInputs).toHaveLength(2);

      const newDateTime = dayjs(MIN_DATE)
        .add(MAX_DAY_SHOW_HOURS - 1, 'day')
        .valueOf();

      const endDateInput = dateRangeInputs[1];

      if (!endDateInput) throw new Error('End date input not found');

      fireEvent.change(endDateInput, {
        target: { value: newDateTime },
      });

      act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(getStockPricesSpy).toHaveBeenCalledWith({
          startDate: formatDateApi(MIN_DATE),
          endDate: formatDateApi(newDateTime),
          multiplier: 1,
          ticker: defaultTicker,
          timespan: 'hour',
        });
      });
    });
  });

  describe('ticker selection', () => {
    it('can select new tickers and fetch new stock prices', async () => {
      renderWithProviders(<StockPrices />);

      const newTickers: Ticker[] = ['AMZN', 'META'];

      expect(screen.getByText('Stock Prices')).toBeInTheDocument();

      await waitFor(() => {
        expect(getStockPricesSpy).toHaveBeenCalledWith({
          startDate: formatDateApi(MIN_DATE),
          endDate: formatDateApi(MAX_DATE),
          multiplier: 1,
          ticker: defaultTicker,
          timespan: 'day',
        });
      });

      const tickerSelectField = screen.getByLabelText('Tickers');

      fireEvent.mouseDown(tickerSelectField);

      for (const ticker of newTickers) {
        const newTickerOption = await screen.findByRole('option', {
          name: `${ticker} (${tickerToName[ticker]})`,
        });
        fireEvent.click(newTickerOption);
      }

      await waitFor(() => {
        expect(getStockPricesSpy).toHaveBeenCalledWith({
          startDate: formatDateApi(MIN_DATE),
          endDate: formatDateApi(MAX_DATE),
          multiplier: 1,
          ticker: newTickers[0],
          timespan: 'day',
        });
      });

      expect(getStockPricesSpy).toHaveBeenCalledWith({
        startDate: formatDateApi(MIN_DATE),
        endDate: formatDateApi(MAX_DATE),
        multiplier: 1,
        ticker: newTickers[1],
        timespan: 'day',
      });

      expect(getStockPricesSpy).toHaveBeenCalledTimes(newTickers.length + 1);
    });

    it('can select a maximum of 3 tickers at a time', async () => {
      renderWithProviders(<StockPrices />);

      const newTickers: Ticker[] = ['AMZN', 'META'];

      expect(screen.getByText('Stock Prices')).toBeInTheDocument();

      await waitFor(() => {
        expect(getStockPricesSpy).toHaveBeenCalledWith({
          startDate: formatDateApi(MIN_DATE),
          endDate: formatDateApi(MAX_DATE),
          multiplier: 1,
          ticker: defaultTicker,
          timespan: 'day',
        });
      });

      const tickerSelectField = screen.getByLabelText('Tickers');

      fireEvent.mouseDown(tickerSelectField);

      for (const ticker of newTickers) {
        const newTickerOption = await screen.findByRole('option', {
          name: `${ticker} (${tickerToName[ticker]})`,
        });
        fireEvent.click(newTickerOption);
      }

      const lastTickerOption = await screen.findByRole('option', {
        name: `MSFT (${tickerToName['MSFT']})`,
      });

      await waitFor(() => {
        expect(lastTickerOption).toHaveAttribute('aria-disabled', 'true');
      });
    });
  });

  describe('ohlc selection', () => {
    it('can select a new OHLC value and render the relevant prices', async () => {
      renderWithProviders(<StockPrices />);

      const newOhlc: OHLC = 'high';

      expect(screen.getByText('Stock Prices')).toBeInTheDocument();

      await waitFor(() => {
        expect(toNivoLineDataSpy).toHaveBeenCalledWith(
          {
            [defaultTicker]: maxRangeStockPrices[defaultTicker],
          },
          defaultOhlc,
          [MIN_DATE, MAX_DATE],
        );
      });

      const ohlcSelectField = screen.getByLabelText('OHLC');

      fireEvent.click(ohlcSelectField);

      const newOHLCOption = screen.getByLabelText(ohlcToLabel[newOhlc]);

      fireEvent.click(newOHLCOption);

      await waitFor(() => {
        expect(toNivoLineDataSpy).toHaveBeenCalledWith(
          {
            [defaultTicker]: maxRangeStockPrices[defaultTicker],
          },
          newOhlc,
          [MIN_DATE, MAX_DATE],
        );
      });
    });
  });

  describe('error handling', () => {
    const errorMessage = 'Invalid request';

    const error = new MockAxiosError('Request failed', {
      data: {
        error: errorMessage,
      },
    });

    beforeEach(() => {
      getStockPricesSpy.mockRejectedValue(error);
    });

    it('should show an error alert and a refetch button if fetching stock prices fails', async () => {
      renderWithProviders(<StockPrices />);

      const errorAlert = await screen.findByText(`Error: ${errorMessage}`);

      expect(errorAlert).toBeInTheDocument();

      expect(screen.queryByText('MockedChart')).not.toBeInTheDocument();

      expect(getStockPricesSpy).toHaveBeenCalledTimes(1);

      const refetchButton = await screen.findByRole('button', { name: 'Refetch data' });

      getStockPricesSpy.mockResolvedValue(maxRangeStockPrices[defaultTicker]);

      fireEvent.click(refetchButton);

      await waitFor(() => {
        expect(getStockPricesSpy).toHaveBeenCalledTimes(2);
      });

      await screen.findByText('MockedChart');

      expect(screen.queryByText(`Error: ${errorMessage}`)).not.toBeInTheDocument();
    });
  });
});
