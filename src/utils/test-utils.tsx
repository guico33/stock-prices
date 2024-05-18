import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import React, { PropsWithChildren } from 'react';

import Providers from '../Providers';

export function renderWithProviders(ui: React.ReactElement, renderOptions: RenderOptions) {
  const Wrapper = ({ children }: PropsWithChildren) => <Providers>{children}</Providers>;

  // Return an object with the store and all of RTL's query functions
  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
