import typography from '../../base/typography';

// Soft UI Dashboard React helper functions
import pxToRem from '../../functions/pxToRem';

const { size } = typography;

const dialogTitle = {
  styleOverrides: {
    root: {
      padding: pxToRem(16),
      fontSize: size.xl,
    },
  },
};

export default dialogTitle;
