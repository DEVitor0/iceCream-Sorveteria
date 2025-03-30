import colors from '../../base/colors';

// Soft UI Dashboard React helper functions
import pxToRem from '../../functions/pxToRem';

const { transparent } = colors;

const select = {
  styleOverrides: {
    select: {
      display: 'grid',
      alignItems: 'center',
      padding: `0 ${pxToRem(12)} !important`,

      '& .Mui-selected': {
        backgroundColor: transparent.main,
      },
    },

    selectMenu: {
      background: 'none',
      height: 'none',
      minHeight: 'none',
      overflow: 'unset',
    },

    icon: {
      display: 'none',
    },
  },
};

export default select;
