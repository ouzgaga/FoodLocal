import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: '#66CCCC',
    },
    secondary: {
      main: '#fff59d',
    },
  },
});

export default theme;
