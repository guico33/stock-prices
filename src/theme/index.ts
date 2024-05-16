import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

// generate theme based on the main color #001e41
const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#e9f0f7',
      100: '#c7d4e6',
      200: '#a3b7d4',
      300: '#7f9ac2',
      400: '#5b7db0',
      500: '#3c5f95',
      600: '#2e4973',
      700: '#1f3351',
      800: '#101d2f',
      900: '#04051a',
    },
  },
});

export default theme;
