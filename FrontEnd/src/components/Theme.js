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
      main: '#66cc99',
    },
  },
});

export default theme;
