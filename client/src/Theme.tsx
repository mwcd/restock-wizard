import { createMuiTheme } from '@material-ui/core'
import { deepPurple } from '@material-ui/core/colors';

export const theme = createMuiTheme({
  props: {
    // Name of the component
    MuiButtonBase: {
      // The properties to apply
      disableRipple: true // No more ripple, on the whole application!
    }
  },
  palette: {
    type: 'dark',
    primary: deepPurple,
  },
});