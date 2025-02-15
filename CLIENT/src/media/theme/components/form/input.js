import colors from 'assets/theme/base/colors';
import borders from 'assets/theme/base/borders';

// Soft UI Dashboard PRO helper functions
import pxToRem from 'assets/theme/functions/pxToRem';

const { inputColors } = colors;
const { borderWidth, borderRadius } = borders;

const input = {
  styleOverrides: {
    root: {
      display: 'flex !important',
      padding: `${pxToRem(8)} ${pxToRem(28)} ${pxToRem(8)} ${pxToRem(12)} !important`,
      border: `${borderWidth[1]} solid ${inputColors.borderColor.main}`,
      borderRadius: `${borderRadius.md} !important`,

      '& fieldset': {
        border: 'none',
      },
    },

    input: {
      height: pxToRem(22),
      width: 'max-content !important',
    },

    inputSizeSmall: {
      height: pxToRem(14),
    },
  },
};

export default input;
