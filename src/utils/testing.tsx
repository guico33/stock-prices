import { QueryClient } from '@tanstack/react-query';
import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import React, { PropsWithChildren } from 'react';

import Providers from '../Providers';

export function renderWithProviders(ui: React.ReactElement, renderOptions: RenderOptions = {}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }: PropsWithChildren) => (
    <Providers queryClient={queryClient}>{children}</Providers>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

export class MockAxiosError extends Error {
  isAxiosError = true;

  constructor(message: string, public response: { data: { error: string } }) {
    super(message);
    this.response = response;
  }
}
