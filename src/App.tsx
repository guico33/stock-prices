import dayjs from 'dayjs';
import Providers from './Providers';
import StockPrices from './pages/StockPrices';

import isBetween from 'dayjs/plugin/isBetween';
import { GlobalStyles } from '@mui/material';

dayjs.extend(isBetween);

function App() {
  return (
    <Providers>
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
