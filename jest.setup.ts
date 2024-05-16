import '@testing-library/jest-dom';

beforeEach(() => {
  Storage.prototype.getItem = jest.fn(() => JSON.stringify({}));
  Storage.prototype.setItem = jest.fn();
  Storage.prototype.removeItem = jest.fn();
  Storage.prototype.clear = jest.fn();
});

afterEach(() => {
  jest.clearAllTimers();
  jest.clearAllMocks();
});
