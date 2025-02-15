import colors from 'assets/theme/base/colors';

// Soft UI Dashboard React helper functions
import pxToRem from 'assets/theme/functions/pxToRem';

const { transparent } = colors;

const stepper = {
  styleOverrides: {
    root: {
      margin: `${pxToRem(48)} 0`,
      padding: `0 ${pxToRem(12)}`,

      '&.MuiPaper-root': {
        backgroundColor: transparent.main,
      },
    },
  },
};

export default stepper;
