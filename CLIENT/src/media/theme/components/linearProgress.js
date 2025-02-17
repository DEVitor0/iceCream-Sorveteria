import borders from '../base/borders';
import colors from '../base/colors';

// Soft UI Dashboard React helper functions
import pxToRem from '../functions/pxToRem';

const { borderRadius } = borders;
const { light } = colors;

const linearProgress = {
  styleOverrides: {
    root: {
      height: pxToRem(3),
      borderRadius: borderRadius.md,
      overflow: 'visible',
      position: 'relative',
    },

    colorPrimary: {
      backgroundColor: light.main,
    },

    colorSecondary: {
      backgroundColor: light.main,
    },

    bar: {
      height: pxToRem(6),
      borderRadius: borderRadius.sm,
      position: 'absolute',
      transform: `translate(0, ${pxToRem(-1.5)}) !important`,
      transition: 'width 0.6s ease !important',
    },
  },
};

export default linearProgress;
