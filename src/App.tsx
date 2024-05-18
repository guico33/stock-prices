import { GlobalStyles } from '@mui/material';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

import StockPrices from './pages/StockPrices';
import Providers from './Providers';

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
