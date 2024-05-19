import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';

import { GetSingleStockPricesResponse } from '../../services/stocks';

export const generateMaxRangePolygonResponse = (): GetSingleStockPricesResponse => ({
  results: Array.from({ length: 250 }, () => ({
    o: faker.number.int({ min: 0, max: 150 }),
    c: faker.number.int({ min: 0, max: 150 }),
    h: faker.number.int({ min: 0, max: 150 }),
    l: faker.number.int({ min: 0, max: 150 }),
    t: dayjs()
      .subtract(faker.number.int({ min: 2, max: 365 }), 'day')
      .valueOf(),
  })).sort((a, b) => a.t - b.t),
});
