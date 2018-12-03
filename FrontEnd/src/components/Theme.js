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
  overrides: {
    MuiOutlinedInput: {
      input: {
        padding: '10px 5px', // Some CSS
      }
    },
  },
});

export default theme;
