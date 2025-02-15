import pxToRem from 'assets/theme/functions/pxToRem';

// Soft UI Dashboard React base styles
import colors from 'assets/theme/base/colors';
import boxShadows from 'assets/theme/base/boxShadows';
import borders from 'assets/theme/base/borders';

const { transparent } = colors;
const { lg } = boxShadows;
const { borderRadius } = borders;

const popover = {
  styleOverrides: {
    paper: {
      backgroundColor: transparent.main,
      boxShadow: lg,
      padding: pxToRem(8),
      borderRadius: borderRadius.lg,
    },
  },
};

export default popover;
