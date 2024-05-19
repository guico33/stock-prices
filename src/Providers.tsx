import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import theme from './theme';

type ProvidersProps = {
  children: React.ReactNode;
  queryClient: QueryClient;
};

const Providers = ({ children, queryClient }: ProvidersProps) => {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  );
};

export default Providers;
