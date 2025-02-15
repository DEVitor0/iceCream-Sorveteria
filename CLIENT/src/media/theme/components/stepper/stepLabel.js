import typography from 'assets/theme/base/typography';
import colors from 'assets/theme/base/colors';

// Soft UI Dashboard React helper functions
import pxToRem from 'assets/theme/functions/pxToRem';

const { size, fontWeightRegular } = typography;
const { grey, dark, secondary } = colors;

const stepLabel = {
  styleOverrides: {
    label: {
      marginTop: `${pxToRem(8)} !important`,
      fontWeight: fontWeightRegular,
      fontSize: size.md,
      color: grey[300],

      '&.Mui-active': {
        fontWeight: `${fontWeightRegular} !important`,
        color: `${dark.main} !important`,
      },

      '&.Mui-completed': {
        fontWeight: `${fontWeightRegular} !important`,
        color: `${secondary.main} !important`,
      },
    },
  },
};

export default stepLabel;
