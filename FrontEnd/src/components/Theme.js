import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  palette: {
    primary: {
      main: '#66CCCC',
    },
    secondary: {
      main: '#66cc99',
    },
    validate: '#64dd17',
  },
  overrides: {
    MuiOutlinedInput: {
      input: {
        padding: '10px 5px', // Some CSS
      }
    },
    MuiCardContent: {
      root: {
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
      }
    },
  },
});

export default theme;
