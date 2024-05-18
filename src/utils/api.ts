import { isAxiosError } from 'axios';

export const getErrorMessage = (error: unknown): string => {
  const defaultErrorMessage = 'An error occurred. Please try again.';
  const errorPrefix = 'Error: ';
  let message = '';
  if (isAxiosError(error)) {
    message = error.response?.data.error ?? error.message;
  } else if (error instanceof Error) {
    message = error.message;
  }
  return message ? `${errorPrefix}${message}` : defaultErrorMessage;
};
