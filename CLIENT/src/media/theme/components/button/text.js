import colors from 'assets/theme/base/colors';
import typography from 'assets/theme/base/typography';

// Soft UI Dashboard React Helper Functions
import pxToRem from 'assets/theme/functions/pxToRem';

const { transparent, info, secondary, grey } = colors;
const { size } = typography;

const buttonText = {
  base: {
    backgroundColor: transparent.main,
    height: 'max-content',
    color: info.main,
    boxShadow: 'none',
    padding: `${pxToRem(6)} ${pxToRem(12)}`,

    '&:hover': {
      backgroundColor: transparent.main,
      boxShadow: 'none',
      color: info.focus,
    },

    '&:focus': {
      boxShadow: 'none',
      color: info.focus,
    },

    '&:active, &:active:focus, &:active:hover': {
      opacity: 0.85,
      boxShadow: 'none',
    },

    '&:disabled': {
      color: grey[600],
      boxShadow: 'none',
    },

    '& .material-icons, .material-icons-round, svg, span': {
      fontSize: `${pxToRem(16)} !important`,
    },
  },

  small: {
    fontSize: size.xs,

    '& .material-icons, .material-icons-round, svg, span': {
      fontSize: `${pxToRem(12)} !important`,
    },
  },

  large: {
    fontSize: size.sm,

    '& .material-icons, .material-icons-round, svg, span': {
      fontSize: `${pxToRem(22)} !important`,
    },
  },

  primary: {
    color: info.main,
    backgroundColor: transparent.main,

    '&:hover': {
      color: info.focus,
      backgroundColor: transparent.main,
    },

    '&:focus:not(:hover)': {
      color: info.focus,
      backgroundColor: transparent.focus,
      boxShadow: 'none',
    },
  },

  secondary: {
    color: secondary.focus,
    backgroundColor: transparent.main,

    '&:hover': {
      color: secondary.focus,
      backgroundColor: transparent.main,
    },

    '&:focus:not(:hover)': {
      color: secondary.focus,
      backgroundColor: transparent.focus,
      boxShadow: 'none',
    },
  },
};

export default buttonText;
