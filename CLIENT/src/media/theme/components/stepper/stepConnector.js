import borders from '../../base/borders';
import colors from '../../base/colors';

const { dark } = colors;
const { borderWidth, borderColor } = borders;

const stepConnector = {
  styleOverrides: {
    root: {
      color: borderColor,
      transition: 'all 200ms linear',

      '&.Mui-active': {
        color: dark.main,
      },

      '&.Mui-completed': {
        color: dark.main,
      },
    },

    alternativeLabel: {
      top: '14%',
      left: '-50%',
      right: '50%',
    },

    line: {
      borderWidth: `${borderWidth[2]} !important`,
      borderColor: 'currentColor',
    },
  },
};

export default stepConnector;
