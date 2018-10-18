
import { createMuiTheme } from '@material-ui/core/styles';


const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#76dd03',
      },
      secondary: {
        main: '#fff59d',
      },
    },
    typography: {
      useNextVariants: true,
    },
  });
  

export default theme;