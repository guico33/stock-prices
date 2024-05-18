import { createTheme } from '@mui/material/styles';

// generate theme based on the main color #001e41
const theme = createTheme({
  palette: {
    primary: {
      main: '#001e41',
    },
    mode: 'light',
  },
});

export default theme;
