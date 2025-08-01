import boxShadows from '../../base/boxShadows';
import typography from '../../base/typography';
import colors from '../../base/colors';
import borders from '../../base/borders';

// Soft UI Dashboard React helper functions
import pxToRem from '../../functions/pxToRem';

const { lg } = boxShadows;
const { size } = typography;
const { text, white } = colors;
const { borderRadius } = borders;

const menu = {
  defaultProps: {
    disableAutoFocusItem: true,
  },

  styleOverrides: {
    paper: {
      minWidth: pxToRem(160),
      boxShadow: lg,
      padding: `${pxToRem(16)} ${pxToRem(8)}`,
      fontSize: size.sm,
      color: text.main,
      textAlign: 'left',
      backgroundColor: `${white.main} !important`,
      borderRadius: borderRadius.md,
    },
  },
};

export default menu;
