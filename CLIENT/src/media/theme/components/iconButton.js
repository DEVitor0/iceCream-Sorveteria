import colors from '../base/colors';

const { transparent } = colors;

const iconButton = {
  styleOverrides: {
    root: {
      '&:hover': {
        backgroundColor: transparent.main,
      },
    },
  },
};

export default iconButton;
