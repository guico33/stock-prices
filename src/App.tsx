import dayjs from 'dayjs';
import Providers from './Providers';
import StockPrices from './pages/StockPrices';

import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

function App() {
  return (
    <Providers>
      <StockPrices />
    </Providers>
  );
}

export default App;
