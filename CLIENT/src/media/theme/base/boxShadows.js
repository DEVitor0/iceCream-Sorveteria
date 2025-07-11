import colors from './colors';

import boxShadow from '../functions/boxShadow';

const { black, white, info, inputColors, tabs } = colors;

const boxShadows = {
  xs: boxShadow([0, 2], [9, -5], black.main, 0.15),
  sm: boxShadow([0, 5], [10, 0], black.main, 0.12),
  md: `${boxShadow([0, 4], [6, -1], black.light, 0.12)}, ${boxShadow(
    [0, 2],
    [4, -1],
    black.light,
    0.07,
  )}`,
  lg: `${boxShadow([0, 8], [26, -4], black.light, 0.15)}, ${boxShadow(
    [0, 8],
    [9, -5],
    black.light,
    0.06,
  )}`,
  xl: boxShadow([0, 23], [45, -11], black.light, 0.25),
  xxl: boxShadow([0, 20], [27, 0], black.main, 0.05),
  inset: boxShadow([0, 1], [2, 0], black.main, 0.075, 'inset'),
  navbarBoxShadow: `${boxShadow(
    [0, 0],
    [1, 1],
    white.main,
    0.9,
    'inset',
  )}, ${boxShadow([0, 20], [27, 0], black.main, 0.05)}`,
  buttonBoxShadow: {
    main: `${boxShadow([0, 4], [7, -1], black.main, 0.11)}, ${boxShadow(
      [0, 2],
      [4, -1],
      black.main,
      0.07,
    )}`,
    stateOf: `${boxShadow([0, 3], [5, -1], black.main, 0.09)}, ${boxShadow(
      [0, 2],
      [5, -1],
      black.main,
      0.07,
    )}`,
    stateOfNotHover: boxShadow([0, 0], [0, 3.2], info.main, 0.5),
  },
  inputBoxShadow: {
    focus: boxShadow([0, 0], [0, 2], inputColors.boxShadow, 1),
    error: boxShadow([0, 0], [0, 2], inputColors.error, 0.6),
    success: boxShadow([0, 0], [0, 2], inputColors.success, 0.6),
  },
  sliderBoxShadow: {
    thumb: boxShadow([0, 1], [13, 0], black.main, 0.2),
  },
  tabsBoxShadow: {
    indicator: boxShadow([0, 1], [5, 1], tabs.indicator.boxShadow, 1),
  },
};

export default boxShadows;
