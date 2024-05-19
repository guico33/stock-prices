import { GlobalStyles } from '@mui/material';
import { QueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

import StockPrices from './pages/StockPrices';
import Providers from './Providers';

dayjs.extend(isBetween);

const queryClient = new QueryClient();

function App() {
  return (
    <Providers queryClient={queryClient}>
      <GlobalStyles
        styles={(theme) => ({
          body: { backgroundColor: theme.palette.grey[100] },
        })}
      />
      <StockPrices />
    </Providers>
  );
}

export default App;
