import '@testing-library/jest-dom';

import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

jest.mock('@nivo/line', () => ({
  ResponsiveLine: () => 'MockedChart',
}));

jest.mock('./src/constants/environment.ts', () => ({
  POLYGON_API_KEY: 'mock-api-key',
}));

afterEach(() => {
  jest.clearAllTimers();
  jest.clearAllMocks();
});
